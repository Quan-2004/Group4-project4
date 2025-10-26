// (backend/models/User.js)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // 🧩 Thông tin cơ bản
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // select: false để không trả về pass khi query

  // 🧩 Quyền truy cập
  role: { type: String, enum: ['User', 'Admin'], default: 'User' },

  // 🧩 Thông tin reset password
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  // 🧩 Avatar (Cloudinary hoặc mặc định)
  avatar: {
    public_id: {
      type: String,
      default: 'default_avatar_public_id',
    },
    url: {
      type: String,
      default: 'https://i.ibb.co/4pDNDk1/avatar.png',
    },
  },
}, { timestamps: true });

// 🧠 Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 So sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔁 Tạo token reset mật khẩu (trả về token thô để gửi cho user)
userSchema.methods.getResetPasswordToken = function () {
  // 1) tạo token thô
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2) hash token và lưu vào DB
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3) đặt thời hạn (ví dụ 15 phút)
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  // 4) trả về token thô
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
