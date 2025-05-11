// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Case-insensitive header check
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Received headers:', req.headers); // Debugging
      return res.status(401).json({
        success: false,
        message: 'No token provided',
        receivedHeaders: Object.keys(req.headers) // Show available headers
      });
    }

    const token = authHeader.split(' ')[1];
    
    // 3. Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug
      req.user = decoded;
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Malformed token'
      });
    }
};