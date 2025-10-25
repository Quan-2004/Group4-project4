// backend/controllers/userController.js
const User = require('../models/User');

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
