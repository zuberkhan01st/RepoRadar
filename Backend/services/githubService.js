require('dotenv').config();
const axios = require('axios');
const { MongoClient } = require('mongodb');

// GitHub API client setup
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

// MongoDB configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'gitgrok';

// Fetch all repositories for a user
exports.getUserRepos = async (username) => {
  try {
    const response = await githubApi.get(`/users/${username}/repos`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching repos for user ${username}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch repositories for user: ${username}`);
  }
};

// Create an issue in a repository
exports.createIssue = async (owner, repo, title, body) => {
  try {
    const response = await githubApi.post(`/repos/${owner}/${repo}/issues`, {
      title,
      body,
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating issue in ${owner}/${repo}:`, error.response?.data || error.message);
    throw new Error(`Failed to create issue in ${owner}/${repo}`);
  }
};

// Get the default branch of a repository
exports.getDefaultBranch = async (owner, repo) => {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}`);
    return response.data.default_branch;
  } catch (error) {
    console.error(`Error fetching default branch for ${owner}/${repo}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch default branch for ${owner}/${repo}`);
  }
};

// Get the latest commit contributors
exports.getLatestCommitContributors = async (owner, repo) => {
  try {
    const defaultBranch = await exports.getDefaultBranch(owner, repo);
    const response = await githubApi.get(
      `/repos/${owner}/${repo}/commits?sha=${defaultBranch}&per_page=1`
    );
    const latestCommit = response.data[0];
    const author = latestCommit.author?.login || latestCommit.commit.author.name;
    const committer = latestCommit.committer?.login || latestCommit.commit.committer.name;
    return { author, committer };
  } catch (error) {
    console.error(`Error fetching latest commit for ${owner}/${repo}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch latest commit for ${owner}/${repo}`);
  }
};

// Get all contributors (top 100)
exports.getAllContributors = async (owner, repo) => {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/contributors?per_page=100`);
    return response.data.map(c => ({
      login: c.login,
      contributions: c.contributions,
    }));
  } catch (error) {
    console.error(`Error fetching contributors for ${owner}/${repo}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch contributors for ${owner}/${repo}`);
  }
};

// Get detailed information about a repository
exports.getRepoTreeStructure = async (owner, repo, branch = 'master') => {
  try {
    // Debug: Log the request parameters
    console.log('Fetching repo structure for:', { owner, repo, branch });

    // First verify the repo exists
    const repoInfo = await githubApi.get(`/repos/${owner}/${repo}`);
    console.log('Repository found:', repoInfo.data.full_name);

    // Then verify the branch exists
    const branchInfo = await githubApi.get(`/repos/${owner}/${repo}/branches/${branch}`);
    console.log('Branch found:', branchInfo.data.name);

    // Now fetch the tree
    const response = await githubApi.get(
      `/repos/${owner}/${repo}/git/trees/${branchInfo.data.commit.sha}?recursive=true`
    );

    //console.log(response.data.tree);

    return {
      sha: response.data.sha,
      tree: response.data.tree,
      truncated: response.data.truncated || false
    };
    
  } catch (error) {
    // Enhanced error diagnostics
    console.error('GitHub API Request Details:', {
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params
    });

    if (error.response) {
      console.error('GitHub API Response:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
    }

    let message = 'Failed to fetch repository structure';
    if (error.response?.status === 404) {
      if (error.response.data?.message.includes('Not Found')) {
        message = 'Repository or branch not found. Please verify:';
        message += `\n- Does https://github.com/${owner}/${repo}/tree/${branch} exist?`;
        message += `\n- Is your GitHub token valid and has repo access?`;
      }
    }

    throw new Error(`${message}\nTechnical details: ${error.message}`);
  }

};
