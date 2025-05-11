// controllers/userController.js
const { error } = require('console');
const User = require('../models/User');
const githubService = require('../services/githubService');
const groqService = require('../services/groqService');
//const gitingestService = require('../services/gitingestService');
const Chat = require('../models/Chat');
const sanitize = require('sanitize-html'); // Optional: for sanitizing inputs

// Must export getMe
exports.getMe = async (req, res) => {
  try {

    const id = req.user.id;

    const user = await User.findById(id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.check = async (req,res)=>{
  try{
    const response = await groqService.queryLLM("Hi");
    console.log(response);
    return res.json(response);
  }
  catch(err){
    res.status(500).json({error: err.message});
  }
}

exports.getRepos = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "No username is passed!" });
    }

    const repos = await githubService.getUserRepos(username); // 🛠️ added 'await'

    return res.json({ message: "Fetched!", repos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRepo = async (req,res)=>{
  try{
    const {username, repo} = req.body;
    if(!username|| !repo){
      return res.status(400).json("Please provide the username and repo name");
    }
      const info = await githubService.getRepoInfo(username, repo);

      if(!info){
        return res.status(404).json({message:"Error Fetching data"});
      }

      return res.status(200).json({info});
    }  
     catch(err){
    return res.status(500).json({message: err.message});
  }
};

exports.createIssue = async (req,res)=>{
  try{
    const {owner,repo,title,body} = req.body;
    if(!owner|| !repo || !title || !body){
      return res.status(400).json({message: "Give all the values!"});

    }

    const data = await githubService.createIssue(owner,repo,title,body);

    if(!data){
      return res.json({message: "No data!"});
    }

    return res.status(200).json({message: "Done adding the issue!",data});

  }
  catch(err){
    return res.status(500).json({error: err.message});
  }
};

exports.getLatestContributors = async (req,res)=>{
  try{
    const {owner,repo} = req.body;

    if(!owner || !repo) return res.json({message: "Provide the owner and repo!"});

    const data = await githubService.getLatestCommitContributors(owner,repo);

    if(!data){
      return res.status(404).json({message: "Nothings found!"});
    }

    return res.status(200).json({message: data});
  }
  catch(err){
    return res.json({error: err.message});
  }
};

exports.getRepoTreeStructure = async (req, res) => {
  try {
    const { owner, repo, branch = 'main' } = req.body;

    // Check if owner or repo is missing
    if (!owner || !repo) {
      return res.status(400).json({ message: "Owner or repository name is missing!" });
    }

    // Fetch the repository structure using the previously defined method
    const repoStructure = await githubService.getRepoStructure(owner, repo, branch);

    return res.json({ message: "Fetched repo structure!", repoStructure });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getAllContributors = async (req, res) => {
  try {
    const { owner, repo } = req.body;

    if (!owner || !repo) return res.json({ message: "Provide the owner and repo!" });

    const data = await githubService.getLatestCommitContributors(owner, repo);

    if (!data) {
      return res.status(404).json({ message: "Nothings found!" });
    }

    return res.status(200).json({ message: data });
  } catch (err) {
    return res.json({ error: err.message });
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

    // Validate input
    if (!question || !repoUrl) {
      return res.status(400).json({ message: "Question and repository URL are required" });
    }
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
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
        handler: () => githubService.getRepoTreeStructure(sanitizedOwner, sanitizedRepo)
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
        handler: () => ({
          message: `Use this owner: ${owner} and repo: ${repo}`
        })
      },
      notool: {
        label: 'General Question',
        handler: () => ({ message: 'No specific GitHub data required' })
      }
    };

    const selectedHandler = toolHandlers[selectedTool] || toolHandlers.notool;
    dataLabel = selectedHandler.label;
    githubData = await selectedHandler.handler();
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
    return res.status(500).json({
      error: err.message || 'An unexpected error occurred',
      code: err.code || 'INTERNAL_SERVER_ERROR'
    });
  }
};