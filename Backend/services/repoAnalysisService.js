const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);
const groqService = require('./groqService');

class RepoAnalysisService {
    constructor() {
        this.tempDir = path.join(__dirname, '../temp_repos');
    }

    async createTempDirectory() {
        await fs.ensureDir(this.tempDir);
    }    async cleanupTempDirectory(repoPath) {
        try {
            if (await fs.pathExists(repoPath)) {
                console.log(`Cleaning up temporary repository at: ${repoPath}`);
                await fs.remove(repoPath);
                console.log('Cleanup completed successfully');
            }
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }

    // New method to cleanup old temporary repositories
    async cleanupOldRepositories() {
        try {
            const MAX_AGE = 1000 * 60 * 60; // 1 hour in milliseconds
            const now = Date.now();
            
            if (await fs.pathExists(this.tempDir)) {
                const items = await fs.readdir(this.tempDir);
                for (const item of items) {
                    const itemPath = path.join(this.tempDir, item);
                    const stats = await fs.stat(itemPath);
                    
                    // Check if the directory is older than MAX_AGE
                    if (now - stats.ctimeMs > MAX_AGE) {
                        console.log(`Removing old temporary repository: ${itemPath}`);
                        await fs.remove(itemPath);
                    }
                }
            }
        } catch (error) {
            console.error('Error cleaning up old repositories:', error);
        }
    }

    parseGitUrl(url) {
    // Normalize GitHub URL format
    const githubUrlPattern = /github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/;
    const match = url.match(githubUrlPattern);
    if (!match) throw new Error('Invalid GitHub URL');
    
    const owner = match[1];
    const repo = match[2];
    
    // Ensure URL ends with .git
    const normalizedUrl = url.endsWith('.git') ? url : `${url}.git`;
    
    return {
        owner,
        repo,
        cloneUrl: normalizedUrl
    };
}    async cloneRepository(url) {
        const { owner, repo, cloneUrl } = this.parseGitUrl(url);
        const repoPath = path.join(this.tempDir, `${owner}-${repo}-${Date.now()}`);
        
        await this.createTempDirectory();
        
        try {
            // Escape paths for Windows and wrap in quotes
            const escapedCloneUrl = `"${cloneUrl}"`;
            const escapedRepoPath = `"${repoPath}"`;
            const command = `git clone ${escapedCloneUrl} ${escapedRepoPath}`;
            
            console.log('Executing git clone command:', command);
            await execAsync(command);
            return { repoPath, owner, repo };
        } catch (error) {
            await this.cleanupTempDirectory(repoPath);
            throw new Error(`Failed to clone repository: ${error.message}`);
        }
}    async findRelevantFiles(repoPath) {
        const relevantExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.rs', '.php'];
        const excludedDirs = ['node_modules', 'dist', 'build', '__pycache__', 'venv', '.git', 
            'coverage', 'test', 'tests', '.next', '.cache', 'artifacts'];
        
        // Resource limits
        const MAX_FILES = 100; // Maximum files to analyze
        const MAX_FILE_SIZE = 500000; // 500KB max file size
        const MAX_TOTAL_SIZE = 10000000; // 10MB total analysis size
        
        const allFiles = [];
        let totalSize = 0;
        
        async function walk(dir) {
            if (allFiles.length >= MAX_FILES || totalSize >= MAX_TOTAL_SIZE) {
                return;
            }

            const files = await fs.readdir(dir);
            
            for (const file of files) {
                if (allFiles.length >= MAX_FILES || totalSize >= MAX_TOTAL_SIZE) {
                    break;
                }

                const filePath = path.join(dir, file);
                const stat = await fs.stat(filePath);
                
                if (stat.isDirectory()) {
                    if (!excludedDirs.includes(file)) {
                        await walk(filePath);
                    }
                } else if (relevantExtensions.includes(path.extname(file))) {
                    if (stat.size <= MAX_FILE_SIZE) {
                        totalSize += stat.size;
                        if (totalSize <= MAX_TOTAL_SIZE) {
                            allFiles.push({
                                path: filePath,
                                size: stat.size
                            });
                        }
                    }
                }
            }
        }
        
        await walk(repoPath);
        console.log(`Analysis stats: Files: ${allFiles.length}, Total size: ${totalSize / 1024 / 1024}MB`);
        return allFiles.map(f => f.path);
    }    async analyzeFiles(files) {
        const fileContents = [];
        const MAX_CONTENT_PER_FILE = 3000; // Characters per file
        const MAX_TOTAL_CONTENT = 100000; // Total characters for analysis
        let totalContent = 0;
        
        for (const file of files) {
            try {
                if (totalContent >= MAX_TOTAL_CONTENT) {
                    console.log('Reached maximum content limit for analysis');
                    break;
                }

                const content = await fs.readFile(file, 'utf8');
                const relativePath = path.relative(this.tempDir, file);
                
                // Take first part and last part of the file for better context
                const truncatedContent = content.length > MAX_CONTENT_PER_FILE 
                    ? content.slice(0, MAX_CONTENT_PER_FILE / 2) + 
                      '\n... (content truncated) ...\n' +
                      content.slice(-MAX_CONTENT_PER_FILE / 2)
                    : content;

                totalContent += truncatedContent.length;
                
                if (totalContent <= MAX_TOTAL_CONTENT) {
                    fileContents.push({
                        path: relativePath,
                        content: truncatedContent
                    });
                }
            } catch (error) {
                console.error(`Error reading file ${file}:`, error);
            }
        }
        
        console.log(`Content analysis stats: Files processed: ${fileContents.length}, Total content size: ${totalContent / 1024}KB`);
        return fileContents;
    }    async generateReport(fileContents, repoInfo) {
        const prompt = `
        You are an expert code analyzer and technical architect. Analyze the following GitHub repository and generate a comprehensive, professional report.

        Repository Information:
        Owner: ${repoInfo.owner}
        Repository: ${repoInfo.repo}

        Structure Overview:
        ${fileContents.map(f => f.path).join('\\n')}

        Detailed Code Analysis:
        ${fileContents.map(f => `
        File: ${f.path}
        ---
        ${f.content.substring(0, 1000)}
        ---
        `).join('\\n')}

        Generate a detailed markdown report with the following sections:

        # ${repoInfo.repo} - Code Analysis Report

        ## 1. Executive Summary
        - High-level overview of the project
        - Main purpose and functionality
        - Overall code quality assessment
        - Key findings and recommendations

        ## 2. Technical Stack Analysis
        ### Core Technologies
        - Primary programming languages
        - Frameworks and libraries
        - Database systems (if any)
        - External services and APIs

        ### Development Tools
        - Build tools and scripts
        - Testing frameworks
        - Development dependencies
        - DevOps tools

        ## 3. Architecture Assessment
        ### Pattern Analysis
        - Architectural patterns used
        - Design patterns implemented
        - Code organization and structure
        - Component relationships

        ### Code Quality Metrics
        - Code modularity
        - Separation of concerns
        - Code reusability
        - Error handling patterns

        ## 4. Best Practices Evaluation
        ### Coding Standards
        - Naming conventions
        - Code formatting
        - File organization
        - Comment quality

        ### Development Practices
        - Testing approach
        - Version control usage
        - Configuration management
        - Environment setup

        ## 5. Security Analysis
        ### Security Patterns
        - Authentication mechanisms
        - Authorization implementation
        - Data protection measures
        - API security

        ### Vulnerability Assessment
        - Potential security risks
        - Dependency vulnerabilities
        - Code injection possibilities
        - Security best practices compliance

        ## 6. Performance Optimization
        ### Current Performance
        - Resource usage
        - Algorithm efficiency
        - Data structure choices
        - Caching implementation

        ### Optimization Opportunities
        - Performance bottlenecks
        - Optimization suggestions
        - Scalability considerations
        - Resource management improvements

        ## 7. Documentation Assessment
        ### Code Documentation
        - Inline documentation quality
        - API documentation
        - README quality
        - Setup instructions

        ### Project Documentation
        - Architecture documentation
        - Deployment guides
        - Maintenance procedures
        - Contributing guidelines

        ## 8. Recommendations
        ### Critical Improvements
        - High-priority fixes
        - Security improvements
        - Performance optimizations
        - Architecture enhancements

        ### Future Enhancements
        - Scalability suggestions
        - Modern technology adoption
        - Testing improvements
        - Documentation updates

        Format Requirements:
        1. Use proper markdown headings (# for main sections, ## for subsections)
        2. Use bullet points for lists
        3. Use code blocks with syntax highlighting where relevant
        4. Include relevant code examples for improvements
        5. Use tables for comparing options where appropriate
        6. Bold important findings and recommendations
        7. Include emoji indicators for severity/importance:
           🔴 Critical
           🟡 Important
           🟢 Enhancement
        8. Use consistent formatting throughout

        Additional Guidelines:
        - Be specific and actionable in recommendations
        - Provide concrete examples where possible
        - Include both positive aspects and areas for improvement
        - Focus on practical, implementable solutions
        - Consider industry best practices in recommendations
        - Prioritize security and performance considerations
        `;

        return await groqService.queryLLM(prompt);
    }    async analyzeRepository(repoUrl) {
        let repoPath;
        try {
            // Cleanup old repositories first
            await this.cleanupOldRepositories();

            // Clone repository
            console.log('Cloning repository:', repoUrl);
            const repoInfo = await this.cloneRepository(repoUrl);
            repoPath = repoInfo.repoPath;

            // Find and analyze relevant files
            console.log('Finding relevant files...');
            const relevantFiles = await this.findRelevantFiles(repoPath);
            console.log(`Found ${relevantFiles.length} relevant files`);

            console.log('Analyzing files...');
            const fileContents = await this.analyzeFiles(relevantFiles);

            // Generate report
            console.log('Generating analysis report...');
            const report = await this.generateReport(fileContents, {
                owner: repoInfo.owner,
                repo: repoInfo.repo
            });

            const result = {
                success: true,
                report,
                metadata: {
                    filesAnalyzed: relevantFiles.length,
                    owner: repoInfo.owner,
                    repo: repoInfo.repo,
                    analyzedAt: new Date().toISOString()
                }
            };

            return result;

        } catch (error) {
            console.error('Analysis failed:', error);
            throw error;
        } finally {
            // Always cleanup in finally block
            if (repoPath) {
                console.log('Performing cleanup after analysis...');
                await this.cleanupTempDirectory(repoPath);
            }
        }
    }
}

module.exports = new RepoAnalysisService();
