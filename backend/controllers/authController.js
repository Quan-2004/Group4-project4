// backend/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto'); // Dùng để hash token reset password
const sendEmail = require('../utils/sendEmail'); // Giả lập gửi email

// =======================
// @desc    Đăng ký user mới
// @route   POST /api/auth/signup
// @access  Public
// =======================
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

// =======================
// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
// =======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[authController.login] attempt login for:', email);
    // 1. Tìm user bằng email
    // Phải dùng .select('+password') vì ta đã ẩn nó ở schema
    const user = await User.findOne({ email }).select('+password');
    console.log('[authController.login] user found?', !!user, user?._id);

    if (user) {
      console.log('[authController.login] hashed password present?', !!user.password);
      // kiểm tra matchPassword và log kết quả (không in mật khẩu thô)
      const matched = await user.matchPassword(password);
      console.log('[authController.login] matchPassword result:', matched);
      // nếu không khớp, gửi 401
      if (!matched) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      }
      // nếu khớp, tiếp tục trả token
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
    // nếu user không tồn tại
    res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// @desc    Đăng xuất (chỉ là API placeholder)
// @route   POST /api/auth/logout
// @access  Public
// =======================
exports.logout = (req, res) => {
  // Việc logout thực sự là do client xóa token (ví dụ: localStorage)
  res.status(200).json({ message: 'Đăng xuất thành công' });
};

// =======================
// @desc    Quên mật khẩu
// @route   POST /api/auth/forgot-password
// @access  Public
// =======================
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy email' });
    }

    // Lấy reset token (từ hàm userSchema.methods.getResetPasswordToken trong model User)
    const resetToken = user.getResetPasswordToken();

    // Lưu (token đã hash + thời hạn) vào DB
    await user.save({ validateBeforeSave: false });

    // Tạo nội dung email (ở đây chỉ mô phỏng gửi link)
    const message = `Bạn nhận được email này để reset mật khẩu.\n\nToken của bạn là: ${resetToken}\n\nVui lòng gửi PUT request tới: /api/auth/reset-password/${resetToken}`;

    // Mô phỏng gửi email (chỉ log ra console)
    await sendEmail({
      email: user.email,
      subject: 'Yêu cầu Reset Mật khẩu',
      message,
      resetToken
    });

    res.status(200).json({ success: true, message: 'Token đã được gửi (kiểm tra console)' });
  } catch (error) {
    // Nếu lỗi, xóa token trong DB
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// =======================
// @desc    Reset mật khẩu
// @route   PUT /api/auth/reset-password/:token
// @access  Public
// =======================
exports.resetPassword = async (req, res) => {
  try {
    // 1. Lấy token thô từ URL và hash lại
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Tìm user bằng token đã hash và chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() } // $gt = còn hạn
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // 3. Đặt mật khẩu mới
    user.password = req.body.password; // pre-save hook sẽ tự hash
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Reset mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};
