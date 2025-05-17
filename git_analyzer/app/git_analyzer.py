from gitingest import ingest_async  # type: ignore
import aiohttp

async def analyze_repository(repo_url):
    async with aiohttp.ClientSession() as session:
        try:
            # Call ingest_async to fetch repository data
            repo_data = await ingest_async(repo_url, session=session)
            
            # Validate returned data
            if not isinstance(repo_data, dict):
                raise ValueError("Invalid data format returned from ingest_async")
                
            # Ensure required fields are present
            required_fields = ['structure', 'branches', 'recent_commits', 'default_branch']
            if not all(field in repo_data for field in required_fields):
                missing = [field for field in required_fields if field not in repo_data]
                raise ValueError(f"Missing required fields: {missing}")
            
            # Validate structure format
            if not isinstance(repo_data['structure'], list):
                raise ValueError("Structure must be a list")
            if not isinstance(repo_data['branches'], list):
                raise ValueError("Branches must be a list")
            if not isinstance(repo_data['recent_commits'], list):
                raise ValueError("Recent commits must be a list")
            if not isinstance(repo_data['default_branch'], str):
                raise ValueError("Default branch must be a string")
            
            return {
                'structure': repo_data['structure'],
                'branches': repo_data['branches'],
                'recent_commits': repo_data['recent_commits'],
                'default_branch': repo_data['default_branch']
            }
            
        except Exception as e:
            raise RuntimeError(f"Failed to analyze repository: {str(e)}")