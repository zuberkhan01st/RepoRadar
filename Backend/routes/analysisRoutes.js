const express = require('express');
const router = express.Router();
const { analyzeRepository } = require('../controllers/repoAnalysisController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/analysis/repository:
 *   post:
 *     summary: Analyze a GitHub repository
 *     description: Clones a repository, analyzes its contents, and generates a comprehensive report
 *     tags: [Repository Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - repoUrl
 *             properties:
 *               repoUrl:
 *                 type: string
 *                 description: GitHub repository URL
 *     responses:
 *       200:
 *         description: Repository analysis completed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
    '/repository',
    auth,
    [
        body('repoUrl')
            .trim()
            .notEmpty()
            .withMessage('Repository URL is required')
            .matches(/^https?:\/\/github\.com\/[^\/]+\/[^\/]+$/)
            .withMessage('Invalid GitHub repository URL format')
    ],
    analyzeRepository
);

module.exports = router;
