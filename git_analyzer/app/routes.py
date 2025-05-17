from flask import Blueprint, request, jsonify
from .git_analyzer import analyze_repository
import asyncio

bp = Blueprint('main', __name__)

@bp.route('/', methods=['GET'])
def main():
    return jsonify({'message': 'Git Analyzer API is running'}), 200

@bp.route('/analyze', methods=['POST'])
async def analyze():
    try:
        data = request.get_json()
        repo_url = data.get('repoUrl')
        
        if not repo_url:
            return jsonify({'error': 'Repository URL is required'}), 400
            
        # Validate repo URL
        if not repo_url.startswith('https://github.com/'):
            return jsonify({'error': 'Invalid GitHub repository URL'}), 400
            
        result = await analyze_repository(repo_url)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500