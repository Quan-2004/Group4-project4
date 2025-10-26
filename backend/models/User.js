// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // <--- THÊM DÒNG NÀY

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // THÊM 2 TRƯỜNG MỚI
    resetPasswordToken: String,
    resetPasswordExpire: Date

}, { timestamps: true });

// ... (Giữ nguyên hàm pre 'save' để hash mật khẩu) ...

// THÊM PHƯƠNG THỨC MỚI NÀY VÀO TRƯỚC DÒNG module.exports
userSchema.methods.getResetPasswordToken = function() {
    // 1. Tạo token thô
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hash token (để lưu vào DB)
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // 3. Đặt thời gian hết hạn (ví dụ: 15 phút)
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 

    // 4. Trả về token thô (để gửi cho người dùng)
    return resetToken;
};


module.exports = mongoose.model('User', userSchema);