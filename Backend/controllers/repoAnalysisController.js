const repoAnalysisService = require('../services/repoAnalysisService');
const { validationResult } = require('express-validator');

exports.analyzeRepository = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { repoUrl } = req.body;

        // Validate URL format
        if (!repoUrl?.trim() || !repoUrl.includes('github.com')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid GitHub repository URL'
            });
        }

        // Perform analysis
        const analysis = await repoAnalysisService.analyzeRepository(repoUrl);

        return res.status(200).json({
            success: true,
            message: 'Repository analysis completed successfully',
            data: analysis
        });

    } catch (error) {
        console.error('Repository analysis error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to analyze repository',
            error: error.message
        });
    }
};
