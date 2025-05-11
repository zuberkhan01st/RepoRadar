const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Skip auth for chat endpoint
  if (req.path === '/user/chat') {
    return next();
  }

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
  
  // 2. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug

    // 3. Ensure id is present in decoded payload
    if (!decoded.id) {
      console.error('Token payload missing id:', decoded);
      return res.status(401).json({
        success: false,
        message: 'Invalid token: Missing user ID in payload'
      });
    }

    // 4. Attach user data to req.user
    req.user = {
      id: decoded.id, // Explicitly attach id
      ...decoded // Include other fields from payload if needed
    };
    
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