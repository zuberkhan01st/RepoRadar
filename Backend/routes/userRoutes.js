const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/userController.js');

// Protected route (requires JWT)
router.get('/profile', auth, controller.getMe);

router.get('/repos', controller.getRepos);

router.get('/repo',controller.getRepo);

router.post('/issue',controller.createIssue);

router.get('/latest_contributors',controller.getLatestContributors);

module.exports = router;