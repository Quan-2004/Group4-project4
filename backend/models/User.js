const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // select: false để không trả về pass khi query
  role: { type: String, enum: ['User', 'Admin'], default: 'User' },

  // 🟢 Thêm 2 trường này cho chức năng đặt lại mật khẩu
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }

}, { timestamps: true });

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // 🔹 thêm return để tránh chạy tiếp nếu không đổi mật khẩu
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
