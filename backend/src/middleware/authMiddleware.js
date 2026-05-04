const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔐 Auth header:', authHeader ? `Bearer ${authHeader.substring(0, 20)}...` : 'NOT PROVIDED');

    const token = authHeader?.split(' ')[1];

    if (!token) {
      console.warn('⚠️ No token provided in Authorization header');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('🔐 Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.user = { id: decoded.id, role: decoded.role };
    
    console.log('✅ Token verified. User ID:', req.userId, 'Role:', req.userRole);
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = authMiddleware;
