const { extractRepositoryContent } = require('@magarcia/gitingest');
const axios = require('axios');

// Export function using CommonJS module system
module.exports.getRepoStructure = async (repoUrl) => {
  try {
    // Ingest repo data from the provided GitHub repository URL
    const { content, tree } = await extractRepositoryContent(repoUrl);

    // Return repository metadata (structure and content)
    return {
      message: 'Repo data fetched successfully!',
      structure: tree,
      content: content
    };
  } catch (err) {
    console.error('Error fetching repo data:', err);
    throw new Error('Failed to fetch repo data');
  }
};

module.exports.getRepoInfo = async (username, repoName, branch = 'main') => {
  try {
    // Construct the GitHub repository URL with branch support
    const repoUrl = `https://github.com/${username}/${repoName}/tree/${branch}`;

    // Fetch the structure and content of the repository
    const repoData = await module.exports.getRepoStructure(repoUrl);

    // Add additional GitHub API info if needed
    const githubInfo = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
    
    return {
      ...repoData,
      githubMetadata: {
        stars: githubInfo.data.stargazers_count,
        forks: githubInfo.data.forks_count,
        issues: githubInfo.data.open_issues_count,
        license: githubInfo.data.license?.name,
        lastUpdated: githubInfo.data.updated_at
      }
    };
  } catch (err) {
    console.error('Error fetching repository information:', err);
    throw new Error('Failed to fetch repository information');
  }
};
