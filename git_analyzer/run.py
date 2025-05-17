from flask import Flask, request, jsonify
from flask_cors import CORS
from gitingest import ingest_async  # type: ignore
import aiohttp
import os
import json
import re
import time
from typing import Any
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Cache configuration
CACHE_DIR = "/tmp/repo_cache"
CACHE_TTL_SECONDS = 6 * 60 * 60  # 6 hours
CACHE_MAX_FILES = 100

def _enforce_lru_cache_limit():
    """Remove oldest cache files if limit exceeded."""
    try:
        files = [
            (f, os.path.getatime(os.path.join(CACHE_DIR, f)))
            for f in os.listdir(CACHE_DIR)
            if f.endswith(".json")
        ]
        if len(files) > CACHE_MAX_FILES:
            files.sort(key=lambda x: x[1])  # Oldest access time first
            for f, _ in files[:len(files) - CACHE_MAX_FILES]:
                try:
                    os.remove(os.path.join(CACHE_DIR, f))
                except OSError:
                    logger.warning(f"Failed to remove cache file: {f}")
    except OSError as e:
        logger.error(f"Error enforcing cache limit: {e}")

def get_cache_path(owner: str, repo: str) -> str:
    """Get cache file path for a repository."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    return os.path.join(CACHE_DIR, f"{owner}_{repo}.json")

def load_repo_cache(owner: str, repo: str) -> dict[str, Any] | None:
    """Load cached repository data if within TTL."""
    path = get_cache_path(owner, repo)
    if os.path.exists(path):
        try:
            os.utime(path, None)  # Update access time for LRU
            with open(path, "r") as f:
                data = json.load(f)
                cached_at = data.get("cached_at", 0)
                if time.time() - cached_at < CACHE_TTL_SECONDS:
                    logger.info(f"Cache hit for {owner}/{repo}")
                    return data
        except (json.JSONDecodeError, OSError) as e:
            logger.error(f"Error loading cache for {owner}/{repo}: {e}")
    logger.info(f"Cache miss for {owner}/{repo}")
    return None

def save_repo_cache(owner: str, repo: str, summary: Any, tree: Any, content: Any) -> None:
    """Save repository data to cache."""
    path = get_cache_path(owner, repo)
    try:
        with open(path, "w") as f:
            json.dump({"summary": summary, "tree": tree, "content": content, "cached_at": time.time()}, f)
        _enforce_lru_cache_limit()
        logger.info(f"Saved cache for {owner}/{repo}")
    except OSError as e:
        logger.error(f"Error saving cache for {owner}/{repo}: {e}")

async def check_repo_exists(repo_url: str) -> bool:
    """Check if a repository exists and is accessible."""
    api_url = repo_url.replace("github.com", "api.github.com/repos")
    async with aiohttp.ClientSession() as session:
        try:
            headers = {"Accept": "application/vnd.github.v3+json"}
            if os.getenv("GITHUB_TOKEN"):
                headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"
            async with session.get(api_url, headers=headers) as response:
                logger.debug(f"GitHub API response for {api_url}: status={response.status}")
                if response.status != 200:
                    try:
                        error_data = await response.json()
                        logger.error(f"GitHub API error: {json.dumps(error_data, indent=2)}")
                    except Exception:
                        logger.error(f"GitHub API non-JSON error: {await response.text()}")
                return response.status == 200
        except Exception as e:
            logger.error(f"Error checking repo {repo_url}: {e}")
            return False

def parse_tree_to_structure(tree: Any) -> list:
    """Parse the tree into the expected structure format."""
    logger.debug(f"Raw tree: {json.dumps(tree, indent=2)}")
    
    if not tree:
        logger.warning("Tree is empty or None")
        return []
    
    # Case 1: Tree is a string (indented format)
    if isinstance(tree, str):
        lines = tree.strip().split("\n")
        structure = []
        stack = [structure]
        path_stack = [""]
        indent_pattern = re.compile(r"^(\s*)([^\s/]+/?)$")
        
        for line in lines:
            match = indent_pattern.match(line)
            if not match:
                logger.debug(f"Skipping unparseable line: {line}")
                continue
            indent, name = match.groups()
            level = len(indent) // 2  # Assume 2 spaces per indent
            is_dir = name.endswith("/")
            
            while len(stack) > level + 1:
                stack.pop()
                path_stack.pop()
                
            current_path = os.path.join(path_stack[-1], name.rstrip("/"))
            item = {
                "type": "directory" if is_dir else "file",
                "name": name.rstrip("/"),
                "path": current_path
            }
            
            if is_dir:
                item["children"] = []
                stack[-1].append(item)
                stack.append(item["children"])
                path_stack.append(current_path)
            else:
                stack[-1].append(item)
                
        logger.debug(f"Parsed string tree to structure: {json.dumps(structure, indent=2)}")
        return structure
    
    # Case 2: Tree is a list of dicts
    if isinstance(tree, list):
        def convert_node(node):
            if not isinstance(node, dict):
                return None
            item = {
                "type": node.get("type", "file"),
                "name": node.get("name", os.path.basename(node.get("path", ""))),
                "path": node.get("path", "")
            }
            if item["type"] == "directory":
                item["children"] = [
                    child for child in [convert_node(c) for c in node.get("children", [])]
                    if child
                ]
            return item
        structure = [item for item in [convert_node(node) for node in tree] if item]
        logger.debug(f"Parsed list tree to structure: {json.dumps(structure, indent=2)}")
        return structure
    
    # Case 3: Tree is a dict with a 'tree' or 'children' key
    if isinstance(tree, dict):
        tree_list = tree.get("tree") or tree.get("children") or []
        structure = parse_tree_to_structure(tree_list)
        logger.debug(f"Parsed dict tree to structure: {json.dumps(structure, indent=2)}")
        return structure
    
    # Case 4: Tree is a flat list of paths (e.g., ["src/index.js", "README.md"])
    if isinstance(tree, list) and all(isinstance(p, str) for p in tree):
        structure = []
        for path in tree:
            parts = path.strip("/").split("/")
            current = structure
            current_path = ""
            for i, part in enumerate(parts):
                current_path = os.path.join(current_path, part)
                existing = next((item for item in current if item["name"] == part), None)
                if i == len(parts) - 1:
                    # File
                    if not existing:
                        current.append({
                            "type": "file",
                            "name": part,
                            "path": current_path
                        })
                else:
                    # Directory
                    if not existing:
                        new_dir = {
                            "type": "directory",
                            "name": part,
                            "path": current_path,
                            "children": []
                        }
                        current.append(new_dir)
                        current = new_dir["children"]
                    else:
                        current = existing["children"]
        logger.debug(f"Parsed flat path list to structure: {json.dumps(structure, indent=2)}")
        return structure
    
    logger.warning(f"Unsupported tree format: {type(tree)}")
    return []

async def fetch_github_tree(repo_url: str) -> list:
    """Fetch repository tree via GitHub API as a fallback."""
    owner_repo = repo_url.replace("https://github.com/", "").rstrip("/")
    tree_url = f"https://api.github.com/repos/{owner_repo}/git/trees/main?recursive=1"
    
    async with aiohttp.ClientSession() as session:
        headers = {"Accept": "application/vnd.github.v3+json"}
        if os.getenv("GITHUB_TOKEN"):
            headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"
        async with session.get(tree_url, headers=headers) as resp:
            if resp.status != 200:
                logger.error(f"Failed to fetch GitHub tree: {resp.status}")
                return []
            data = await resp.json()
            tree = data.get("tree", [])
            structure = []
            for item in tree:
                path = item["path"]
                parts = path.split("/")
                current = structure
                current_path = ""
                for i, part in enumerate(parts):
                    current_path = os.path.join(current_path, part)
                    existing = next((x for x in current if x["name"] == part), None)
                    if i == len(parts) - 1:
                        if item["type"] == "blob":
                            if not existing:
                                current.append({
                                    "type": "file",
                                    "name": part,
                                    "path": current_path
                                })
                    else:
                        if not existing:
                            new_dir = {
                                "type": "directory",
                                "name": part,
                                "path": current_path,
                                "children": []
                            }
                            current.append(new_dir)
                            current = new_dir["children"]
                        else:
                            current = existing["children"]
            logger.debug(f"Fetched GitHub tree: {json.dumps(structure, indent=2)}")
            return structure

async def fetch_github_data(repo_url: str) -> dict:
    """Fetch branches, recent commits, and default branch via GitHub API."""
    owner_repo = repo_url.replace("https://github.com/", "").rstrip("/")
    branches_url = f"https://api.github.com/repos/{owner_repo}/branches"
    commits_url = f"https://api.github.com/repos/{owner_repo}/commits?per_page=5"
    repo_url_api = f"https://api.github.com/repos/{owner_repo}"
    
    async with aiohttp.ClientSession() as session:
        headers = {"Accept": "application/vnd.github.v3+json"}
        if os.getenv("GITHUB_TOKEN"):
            headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"
        
        # Fetch branches
        branches = []
        async with session.get(branches_url, headers=headers) as resp:
            if resp.status == 200:
                branches = [f"refs/heads/{b['name']}" for b in await resp.json()]
            else:
                logger.error(f"Failed to fetch branches: {resp.status}")
                raise ValueError(f"Failed to fetch branches: {resp.status}")
                
        # Fetch recent commits
        recent_commits = []
        async with session.get(commits_url, headers=headers) as resp:
            if resp.status == 200:
                commits = await resp.json()
                recent_commits = [
                    {
                        "sha": c["sha"],
                        "message": c["commit"]["message"].strip(),
                        "author": c["commit"]["author"]["name"],
                        "date": c["commit"]["author"]["date"]
                    }
                    for c in commits
                ]
            else:
                logger.error(f"Failed to fetch commits: {resp.status}")
                raise ValueError(f"Failed to fetch commits: {resp.status}")
                
        # Fetch default branch
        default_branch = "refs/heads/main"
        async with session.get(repo_url_api, headers=headers) as resp:
            if resp.status == 200:
                default_branch = f"refs/heads/{(await resp.json())['default_branch']}"
            else:
                logger.error(f"Failed to fetch repository info: {resp.status}")
                raise ValueError(f"Failed to fetch repository info: {resp.status}")
                
        return {
            "branches": branches,
            "recent_commits": recent_commits,
            "default_branch": default_branch
        }

@app.route("/analyze", methods=["POST"])
async def analyze():
    try:
        data = request.get_json()
        repo_url = data.get("repoUrl")
        print(repo_url)
        
        if not repo_url:
            return jsonify({"error": "Repository URL is required"}), 400
            
        if not repo_url.startswith("https://github.com/"):
            return jsonify({"error": "Invalid GitHub repository URL"}), 400
            
        # Extract owner and repo for caching
        owner_repo = repo_url.replace("https://github.com/", "").rstrip("/").split("/")
        if len(owner_repo) != 2:
            return jsonify({"error": "Invalid repository URL format"}), 400
        owner, repo = owner_repo
        
        # Check cache
        cached_data = load_repo_cache(owner, repo)
        if cached_data:
            structure = parse_tree_to_structure(cached_data["tree"])
            if not structure:
                logger.warning("Empty structure from cached tree, fetching from GitHub")
                structure = await fetch_github_tree(repo_url)
            github_data = await fetch_github_data(repo_url)
            return jsonify({
                "structure": structure,
                "branches": github_data["branches"],
                "recent_commits": github_data["recent_commits"],
                "default_branch": github_data["default_branch"]
            }), 200
            
        # Check repository accessibility
        if not await check_repo_exists(repo_url):
            return jsonify({"error": "Repository not found or inaccessible"}), 404
            
        # Ingest repository
        summary, tree, content = await ingest_async(
            repo_url, exclude_patterns={"tests/*", "docs/*"}
        )
        
        # Check token count
        if "Estimated tokens: " in summary:
            tokens_str = summary.split("Estimated tokens: ")[-1].strip()
            if tokens_str.endswith("M"):
                return jsonify({"error": "Repository too large"}), 400
            elif tokens_str.endswith("K"):
                tokens = float(tokens_str[:-1])
                if tokens > 750:
                    return jsonify({"error": "Repository too large"}), 400
        
        # Save to cache
        save_repo_cache(owner, repo, summary, tree, content)
        
        # Parse tree and fetch GitHub data
        structure = parse_tree_to_structure(tree)
        if not structure:
            logger.warning("Empty structure from ingest_async, fetching from GitHub")
            structure = await fetch_github_tree(repo_url)
        github_data = await fetch_github_data(repo_url)
        
        return jsonify({
            "structure": structure,
            "branches": github_data["branches"],
            "recent_commits": github_data["recent_commits"],
            "default_branch": github_data["default_branch"]
        }), 200
        
    except ValueError as ve:
        error_msg = str(ve)
        if error_msg == "error:repo_not_found":
            return jsonify({"error": "Repository not found"}), 404
        elif error_msg == "error:repo_too_large":
            return jsonify({"error": "Repository too large"}), 400
        elif error_msg == "error:repo_private":
            return jsonify({"error": "Repository is private or rate limit exceeded"}), 403
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({"error": f"Failed to analyze repository: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)