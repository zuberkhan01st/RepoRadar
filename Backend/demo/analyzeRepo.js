const repoAnalysisService = require('../services/repoAnalysisService');

async function demoAnalysis() {
    try {
        console.log('Starting repository analysis...');
        
        // Replace with a real GitHub repository URL
        const repoUrl = 'https://github.com/expressjs/express';
        
        console.log(`Analyzing repository: ${repoUrl}`);
        
        const analysis = await repoAnalysisService.analyzeRepository(repoUrl);
        
        console.log('\n=== Analysis Results ===\n');
        console.log('Files Analyzed:', analysis.metadata.filesAnalyzed);
        console.log('Repository:', `${analysis.metadata.owner}/${analysis.metadata.repo}`);
        console.log('\nReport:\n');
        console.log(analysis.report);
        
    } catch (error) {
        console.error('Analysis failed:', error.message);
    }
}

// Run the demo
demoAnalysis();
