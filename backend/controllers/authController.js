// backend/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Đăng ký user mới
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Kiểm tra email trùng 
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // 2. Tạo user mới (mật khẩu sẽ tự động được hash bởi pre-hook)
    const user = await User.create({ name, email, password });

    // 3. Trả về thông tin user và token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user bằng email
    // Phải dùng .select('+password') vì ta đã ẩn nó ở schema
    const user = await User.findOne({ email }).select('+password');

    // 2. Kiểm tra user và mật khẩu có khớp không
    if (user && (await user.matchPassword(password))) {
      // 3. Trả về thông tin user và token
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đăng xuất (chỉ là API placeholder)
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  // Việc logout thực sự là do client (Quân) xóa token [cite: 143]
  res.status(200).json({ message: 'Đăng xuất thành công' });
};