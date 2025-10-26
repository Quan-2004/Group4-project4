const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

  // 🧩 Avatar (dành cho Cloudinary hoặc ảnh mặc định)
  avatar: {
    public_id: {
      type: String,
      default: 'default_avatar_public_id' // ID Cloudinary mặc định
    },
    url: {
      type: String,
      default: 'https://i.ibb.co/4pDNDk1/avatar.png' // link ảnh mặc định
    }
  }

}, { timestamps: true });

// 🧠 Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // chỉ mã hóa khi mật khẩu bị thay đổi hoặc mới tạo
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 So sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
