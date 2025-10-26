// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Import toàn bộ các hàm controller
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

// Đăng ký tài khoản
router.post('/signup', signup);

// Đăng nhập
router.post('/login', login);

// Đăng xuất
router.post('/logout', logout);

// Quên mật khẩu - gửi token qua email
router.post('/forgot-password', forgotPassword);

// Reset mật khẩu bằng token
router.put('/reset-password/:token', resetPassword);

module.exports = router;
