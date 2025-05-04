// controllers/userController.js
const { error } = require('console');
const User = require('../models/User');
const githubService = require('../services/githubService');


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
}


