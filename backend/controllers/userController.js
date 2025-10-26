// backend/controllers/userController.js
const User = require('../models/User');

const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto'); // Thêm crypto
const sendEmail = require('../utils/sendEmail'); // Thêm sendEmail
// GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ message: 'name & email are required' });
    }
    const created = await User.create({ name: name.trim(), email: email.trim() });
    res.status(201).json(created);
  } catch (e) {
    if (e.code === 11000) { // duplicate email
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted', user: deleted });
  } catch (e) {
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
}

// @desc    Lấy thông tin profile user
// @route   GET /api/users/profile
// @access  Private (đã được 'protect' bảo vệ)
exports.getUserProfile = async (req, res) => {
  // req.user đã được gán từ middleware 'protect'
  const user = req.user;
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

// @desc    Cập nhật thông tin profile user
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Nếu user có nhập mật khẩu mới
    if (req.body.password) {
      user.password = req.body.password; // Hook 'pre-save' trong User.js sẽ tự động hash
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      // Trả về token mới nếu bạn muốn, nhưng không bắt buộc
    });
  } else {
    res.status(404).json({ message: 'Không tìm thấy user' });
  }
};


// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(404);
        throw new Error('Không tìm thấy người dùng với email này');
    }

    // 1. Tạo reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Mã hóa token và lưu vào DB (Không lưu token gốc)
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // 3. Đặt thời gian hết hạn (ví dụ: 10 phút)
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 

    await user.save();

    // 4. Tạo URL reset (trỏ đến trang frontend)
    // Quân (Frontend) sẽ tạo trang này
    const resetUrl = `${req.protocol}://localhost:3000/reset-password/${resetToken}`; 

    const message = `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập liên kết sau để đặt lại mật khẩu (liên kết có hiệu lực 10 phút): \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            message,
        });

        res.status(200).json({ success: true, data: 'Email đã được gửi' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(500);
        throw new Error('Gửi email thất bại');
    }
});

// @desc    Reset password
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    // 1. Lấy token đã hash từ URL
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // 2. Tìm user bằng token VÀ thời gian chưa hết hạn
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }

    // 3. Đặt mật khẩu mới
    // Middleware pre-save (trong userModel) sẽ tự động hash mật khẩu này
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // 4. Đăng nhập user luôn (tùy chọn) hoặc yêu cầu đăng nhập lại
    // Ở đây ta yêu cầu đăng nhập lại
    res.status(200).json({ success: true, data: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.' });
});

module.exports = {
    // ... (các hàm cũ)
    forgotPassword,
    resetPassword,
};