// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // <--- THÊM DÒNG NÀY

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // THÊM 2 TRƯỜNG MỚI
    resetPasswordToken: String,
    resetPasswordExpire: Date

}, { timestamps: true });

// Hash mật khẩu trước khi lưu vào database
userSchema.pre('save', async function(next) {
    // Chỉ hash nếu password được thay đổi (hoặc tạo mới)
    if (!this.isModified('password')) {
        return next();
    }
    
    // Hash password với salt rounds = 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method để so sánh password khi đăng nhập
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

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