// controllers/userController.js
const { error } = require('console');
const User = require('../models/User');
const githubService = require('../services/githubService');
const groqService = require('../services/groqService');
//const gitingestService = require('../services/gitingestService');


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




exports.getAllContributors = async (req,res)=>{
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

exports.chatAboutRepo = async (req, res) => {
  try {
    const { question, owner, repo } = req.body;

    if (!question || !owner || !repo) {
      return res.status(400).json({ message: "Provide question, owner, and repo" });
    }

    const toolSelectorPrompt = `
      You are an AI deciding which GitHub tool to use.
      Tools:
      - getRepoInfo
      - getRecentCommits
      - getLatestCommitContributors
      - getAllContributors
      - createIssue
      - getCodeStructure

      User question: "${question}"
      Just respond with only one most important tool name. No extra text.
    `;

    const selectedTool = (await groqService.queryLLM(toolSelectorPrompt)).toLowerCase();
    console.log("LLM selected tool:", selectedTool);

    let githubData = "";
    let dataLabel = "";

    switch (selectedTool) {
      case "getrecentcommits":
        githubData = JSON.stringify(await githubService.getRecentCommits(owner, repo), null, 2);
        dataLabel = "Recent Commits";
        break;
      case "getlatestcommitcontributors":
        githubData = JSON.stringify(await githubService.getLatestCommitContributors(owner, repo), null, 2);
        dataLabel = "Latest Contributors";
        break;
      case "getallcontributors":
        githubData = JSON.stringify(await githubService.getAllContributors(owner, repo), null, 2);
        dataLabel = "All Contributors";
        break;
      case "getCodeStructure":
        githubData = JSON.stringify(await githubService.getRepoTreeStructure(owner, repo), null, 2);
        dataLabel = "Code Structure";
        break;
      case "getrepoinfo":
      default:
        githubData = JSON.stringify(await githubService.getRepoTreeStructure(owner, repo), null, 2);
        dataLabel = "Repository Info";
        break;
    }

    const finalPrompt = `
      You are a GitHub assistant chatbot.
      User asked: "${question}"

      Based on this GitHub data (${dataLabel}):
      ${githubData}

      Give a helpful, concise, human-readable response.
      
    `;

    const finalAnswer = await groqService.queryLLM(finalPrompt);

    return res.status(200).json({ answer: finalAnswer, tool: selectedTool });
  } catch (err) {
    console.error("chatAboutRepo error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};



