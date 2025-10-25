// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Giả sử model User của bạn ở đây

// Middleware 1: Xác thực Token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ token (trừ password)
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware 2: Kiểm tra quyền Admin (RBAC) [cite: 287, 289]
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') { // Giả sử trong schema User có trường 'role'
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an Admin' });
  }
};