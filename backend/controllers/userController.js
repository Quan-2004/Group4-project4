// backend/controllers/userController.js
const User = require('../models/User'); // hoặc '../models/userModel' tùy bạn đặt tên file model nào tồn tại
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

// POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ message: 'name & email are required' });
    }
    const created = await User.create({ name: name.trim(), email: email.trim() });
    res.status(201).json(created);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
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
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted', user: deleted });
  } catch (e) {
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

// GET /api/users/profile (Private)
const getUserProfile = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

// PUT /api/users/profile (Private)
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // pre-save sẽ hash
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404).json({ message: 'Không tìm thấy user' });
  }
};

// POST /api/users/forgot-password (Public)
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng với email này');
  }

  // 1) Tạo reset token gốc
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2) Hash token để lưu DB
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3) Hết hạn sau 10 phút
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  // 4) Link reset (frontend sẽ xử lý trang này)
  const resetUrl = `${req.protocol}://localhost:3000/reset-password/${resetToken}`;

  const message =
    `Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu.\n` +
    `Vui lòng truy cập liên kết sau (hiệu lực 10 phút):\n\n${resetUrl}`;

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

// POST /api/users/reset-password/:token (Public)
const resetPassword = asyncHandler(async (req, res) => {
  // 1) Hash token từ URL để đối chiếu DB
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // 2) Tìm user còn hạn token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Token không hợp lệ hoặc đã hết hạn');
  }

  // 3) Cập nhật mật khẩu mới
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ success: true, data: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.' });
});

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
