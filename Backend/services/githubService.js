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
exports.getRepoInfo = async (owner, repo) => {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}`);
    
    const {
      name,
      full_name,
      description,
      language,
      stargazers_count,
      forks_count,
      open_issues_count,
      license,
      created_at,
      updated_at,
      visibility,
      html_url,
    } = response.data;

    return {
      name,
      full_name,
      description,
      language,
      stars: stargazers_count,
      forks: forks_count,
      open_issues: open_issues_count,
      license: license?.name || 'No license',
      created_at,
      updated_at,
      visibility,
      url: html_url,
    };
  } catch (error) {
    console.error(`Error fetching info for ${owner}/${repo}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch repository info for ${owner}/${repo}`);
  }
};


