// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Kiểm tra xem header có Authorization và bắt đầu bằng 'Bearer' không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Tách lấy token (bỏ chữ 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 3. Giải mã token để lấy id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Lấy thông tin user từ id (không lấy mật khẩu)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // 5. Cho phép request đi tiếp
    } catch (error) {
      res.status(401).json({ message: 'Token không hợp lệ' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không có quyền truy cập, không tìm thấy token' });
  }
};

module.exports = { protect };