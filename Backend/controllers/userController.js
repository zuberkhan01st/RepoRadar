// controllers/userController.js
const { error } = require('console');
const User = require('../models/User');
const githubService = require('../services/githubService');
const groqService = require('../services/groqService');
const Chat = require('../models/Chat');
const sanitize = require('sanitize-html');
const axios = require('axios');

// Helper function for consistent error responses
const sendErrorResponse = (res, statusCode, message, error = null) => {
  console.error(`Error: ${message}`, error);
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error: error.message })
  });
};

// Helper function for successful responses
const sendSuccessResponse = (res, data, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

// Must export getMe
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }
    return sendSuccessResponse(res, { user });
  } catch (err) {
    return sendErrorResponse(res, 500, 'Failed to fetch user details', err);
  }
};

exports.check = async (req, res) => {
  try {
    const response = await groqService.queryLLM("Hi");
    return sendSuccessResponse(res, { response });
  } catch (err) {
    return sendErrorResponse(res, 500, 'LLM query failed', err);
  }
};

exports.getRepos = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username?.trim()) {
      return sendErrorResponse(res, 400, 'Username is required');
    }

    const repos = await githubService.getUserRepos(username);
    return sendSuccessResponse(res, { repos }, 'Repositories fetched successfully');
  } catch (err) {
    return sendErrorResponse(res, 500, 'Failed to fetch repositories', err);
  }
};

exports.getRepo = async (req, res) => {
  try {
    const { username, repo } = req.body;
    if (!username?.trim() || !repo?.trim()) {
      return sendErrorResponse(res, 400, 'Username and repository name are required');
    }

    const info = await githubService.getRepoInfo(username, repo);
    if (!info) {
      return sendErrorResponse(res, 404, 'Repository not found');
    }

    return sendSuccessResponse(res, { info }, 'Repository information fetched successfully');
  } catch (err) {
    return sendErrorResponse(res, 500, 'Failed to fetch repository information', err);
  }
};

exports.createIssue = async (req, res) => {
  try {
    const { owner, repo, title, body } = req.body;
    if (!owner || !repo || !title || !body) {
      return sendErrorResponse(res, 400, 'Provide all the values!');
    }

    const data = await githubService.createIssue(owner, repo, title, body);

    if (!data) {
      return sendErrorResponse(res, 404, 'No data!');
    }

    return sendSuccessResponse(res, { data }, 'Issue created successfully');
  } catch (err) {
    return sendErrorResponse(res, 500, 'Failed to create issue', err);
  }
};

exports.getLatestContributors = async (req, res) => {
  try {
    const { owner, repo } = req.body;

    if (!owner || !repo) return sendErrorResponse(res, 400, 'Provide the owner and repo!');

    const data = await githubService.getLatestCommitContributors(owner, repo);

    if (!data) {
      return sendErrorResponse(res, 404, 'Nothing found!');
    }

    return sendSuccessResponse(res, { contributors: data }, 'Contributors fetched successfully');
  } catch (err) {
    return sendErrorResponse(res, 500, 'Failed to fetch contributors', err);
  }
};

exports.getRepoTreeStructure = async (req, res) => {
  try {
    const { owner, repo, branch = 'main' } = req.body;

    // Check if owner or repo is missing
    if (!owner || !repo) {
      return sendErrorResponse(res, 400, 'Owner or repository name is missing!');
    }

    // Fetch the repository structure using the previously defined method
    const repoStructure = await githubService.getRepoStructure(owner, repo, branch);

    return sendSuccessResponse(res, { repoStructure }, 'Fetched repo structure');
  } catch (error) {
    return sendErrorResponse(res, 500, 'Failed to fetch repo structure', error);
  }
};

exports.getAllContributors = async (req, res) => {
  try {
    const { owner, repo } = req.body;
    if (!owner?.trim() || !repo?.trim()) {
      return sendErrorResponse(res, 400, 'Owner and repository name are required');
    }

    const data = await githubService.getLatestCommitContributors(owner, repo);
    if (!data) {
      return sendErrorResponse(res, 404, 'No contributors found');
    }

    return sendSuccessResponse(res, { contributors: data }, 'Contributors fetched successfully');
  } catch (err) {
    return sendErrorResponse(res, 500, 'Failed to fetch contributors', err);
  }
};

// Helper function to parse GitHub URL
const parseGitHubUrl = (url) => {
  try {
    // Handle both https and ssh URLs
    const urlPattern = /(?:https?:\/\/github\.com\/|git@github\.com:)([^\/]+)\/([^\/\.]+)(?:\.git)?/;
    const match = url.match(urlPattern);
    
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    
    return {
      owner: match[1],
      repo: match[2]
    };
  } catch (error) {
    throw new Error('Failed to parse GitHub URL: ' + error.message);
  }
};

exports.chatAboutRepo = async (req, res) => {
  try {
    const { question, repoUrl, additionalParams = {} } = req.body;
    const userId = req.user?.id;

    if (!question?.trim() || !repoUrl?.trim()) {
      return sendErrorResponse(res, 400, 'Question and repository URL are required');
    }
    if (!userId) {
      return sendErrorResponse(res, 401, 'User authentication required');
    }

    // Parse the repository URL
    const { owner, repo } = parseGitHubUrl(repoUrl);

    // Sanitize inputs
    const sanitizedQuestion = sanitize(question, { allowedTags: [], allowedAttributes: {} });
    const sanitizedOwner = sanitize(owner, { allowedTags: [], allowedAttributes: {} });
    const sanitizedRepo = sanitize(repo, { allowedTags: [], allowedAttributes: {} });

    // Save user message
    const userChat = new Chat({
      userId,
      botId: 'github-assistant',
      message: sanitizedQuestion,
      senderType: 'user',
      context: { owner: sanitizedOwner, repo: sanitizedRepo }
    });
    await userChat.save();

    // Tool selector prompt
    const toolSelectorPrompt = `
      You are an AI selecting the most appropriate GitHub tool for a user's question.
      Available tools:
      - getRepoInfo: General repository information (e.g., description, stars)
      - getRecentCommits: Recent commit history
      - getLatestCommitContributors: Contributors to the latest commit
      - getAllContributors: All repository contributors
      - getCodeStructure: Repository file and folder structure
      - createIssue: Create a new GitHub issue
      - createPullRequest: Create a new pull request
      - listOpenIssues: List all open issues
      - createRepoWebhook: Create a repository webhook
      - noTool: General questions not requiring specific GitHub data

      User question: "${sanitizedQuestion}"
      Respond with only the tool name in lowercase.
    `;
    const selectedTool = (await groqService.queryLLM(toolSelectorPrompt)).toLowerCase().trim();

    // Validate selected tool
    const validTools = [
      'getrepoinfo', 'getrecentcommits', 'getlatestcommitcontributors',
      'getallcontributors', 'getcodestructure', 'createissue',
      'createpullrequest', 'listopenissues', 'createrepowebhook', 'notool'
    ];
    if (!validTools.includes(selectedTool)) {
      throw new Error(`Invalid tool selected: ${selectedTool}`);
    }

    // Handle GitHub data fetching
    let githubData = null;
    let dataLabel = '';

    const toolHandlers = {
      getrecentcommits: {
        label: 'Recent Commits',
        handler: () => githubService.getRecentCommits(sanitizedOwner, sanitizedRepo)
      },
      getlatestcommitcontributors: {
        label: 'Latest Commit Contributors',
        handler: () => githubService.getLatestCommitContributors(sanitizedOwner, sanitizedRepo)
      },
      getallcontributors: {
        label: 'All Contributors',
        handler: () => githubService.getAllContributors(sanitizedOwner, sanitizedRepo)
      },
      getcodestructure: {
        label: 'Code Structure',
        handler: async () => {
          try {
            const response = await fetch('http://localhost:5001/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ repoUrl }),
              timeout: 5000 // 5 second timeout
            });
    
            if (!response.ok) {
              throw new Error(`Flask backend responded with status ${response.status}`);
            }
    
            const data = await response.json();
            return data;
          } catch (error) {
            console.error('Flask backend error:', error);
            // Fallback to GitHub API if Flask fails
            return githubService.getRepoContent(sanitizedOwner, sanitizedRepo);
          }
        }
      },
    
      createissue: {
        label: 'Created Issue',
        handler: () => {
          const { issueTitle, issueBody } = additionalParams;
          if (!issueTitle || !issueBody) {
            throw new Error('issueTitle and issueBody are required for creating an issue');
          }
          return githubService.createIssue(sanitizedOwner, sanitizedRepo, issueTitle, issueBody);
        }
      },
      createpullrequest: {
        label: 'Created Pull Request',
        handler: () => {
          const { prTitle, prHead, prBase, prBody } = additionalParams;
          if (!prTitle || !prHead || !prBase || !prBody) {
            throw new Error('prTitle, prHead, prBase, and prBody are required for creating a pull request');
          }
          return githubService.createPullRequest(sanitizedOwner, sanitizedRepo, prTitle, prHead, prBase, prBody);
        }
      },
      listopenissues: {
        label: 'Open Issues',
        handler: () => githubService.listOpenIssues(sanitizedOwner, sanitizedRepo)
      },
      createrepowebhook: {
        label: 'Created Webhook',
        handler: () => {
          const { webhookUrl, events } = additionalParams;
          if (!webhookUrl) {
            throw new Error('webhookUrl is required for creating a webhook');
          }
          return githubService.createRepoWebhook(sanitizedOwner, sanitizedRepo, webhookUrl, events || ['push', 'pull_request']);
        }
      },
      getrepoinfo: {
        label: 'Repository Information',
        handler: async () => {
          try {
            // First try GitHub API directly
            //const repoInfo = await githubService.getRepoInfo(sanitizedOwner, sanitizedRepo);
            
            // If you need additional analysis from Flask:
            try {
              const response = await fetch('http://localhost:5001/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl }),
                timeout: 5000
              });
    
              if (response.ok) {
                const flaskData = await response.json();
                return { ...repoUrl, analysis: flaskData };
              }
            } catch (flaskError) {
              console.error('Flask analysis failed, using GitHub data only:', flaskError);
            }
    
            return repoInfo;
          } catch (error) {
            throw new Error(`Failed to get repository info: ${error.message}`);
          }
        }
      },
      notool: {
        label: 'General Question',
        handler: () => ({ message: 'No specific GitHub data required' })
      }
    };

    const selectedHandler = toolHandlers[selectedTool] || toolHandlers.notool;
    dataLabel = selectedHandler.label;
    githubData = await selectedHandler.handler();
    //console.log("githubData");
    //console.log(githubData);
    const formattedGithubData = JSON.stringify(githubData, null, 2);

    // Fetch chat history (last 5 messages for this user and repo)
    const history = await Chat.find({
      userId,
      'context.repo': sanitizedRepo
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Final response prompt
    //console.log(formattedGithubData);
    const finalPrompt = `
      You are an expert GitHub assistant providing accurate and helpful responses.
      
      User question: "${sanitizedQuestion}" about the repository: ${sanitizedOwner}/${sanitizedRepo}
      
      Repository Information:
      - Owner: ${sanitizedOwner}
      - Repository: ${sanitizedRepo}
      - Data Type: ${dataLabel}
      
      Relevant GitHub data:
      ${formattedGithubData}
      
      Recent chat history (use only if relevant to the current question):
      ${JSON.stringify(history, null, 2)}
      
      Guidelines:
      - Provide a concise, accurate response based on the GitHub data
      - Use chat history only if it provides relevant context for the current question
      - Format the response as a JSON object with a "response" field
      - Avoid unnecessary details and keep the response focused
      - If the data is insufficient, suggest next steps or clarify limitations
      - Do not include raw JSON data in the response unless explicitly requested
      - Ensure the response is a string, not an array
      - Always reference the specific repository (${sanitizedOwner}/${sanitizedRepo}) in your response
      
      Return only the JSON response object.
    `;
    const finalAnswer = await groqService.queryLLM(finalPrompt);
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(finalAnswer);
      if (!parsedResponse.response) {
        throw new Error('Response field missing in LLM output');
      }
      // Ensure response is a string
      if (Array.isArray(parsedResponse.response)) {
        parsedResponse.response = parsedResponse.response.join(', ');
      }
    } catch (parseError) {
      parsedResponse = { response: finalAnswer }; // Fallback
    }

    // Save bot response
    const botChat = new Chat({
      userId,
      botId: 'github-assistant',
      message: String(parsedResponse.response), // Ensure message is a string
      senderType: 'bot',
      context: { owner: sanitizedOwner, repo: sanitizedRepo }
    });
    await botChat.save();

    return res.status(200).json({
      message: parsedResponse.response,
      history,
      selectedTool,
      githubData: formattedGithubData,
      dataLabel
    });

  } catch (err) {
    console.error('Error in chatAboutRepo:', {
      message: err.message,
      stack: err.stack,
      userId: req.user?.id
    });
    return sendErrorResponse(res, 500, 'Chat processing failed', err);
  }
};