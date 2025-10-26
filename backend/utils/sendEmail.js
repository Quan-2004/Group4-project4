// utils/sendEmail.js
const sendEmail = async (options) => {
    console.log('--- MÔ PHỎNG GỬI EMAIL ---');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);

    // Log token ra console để Đăng có thể test
    console.log(`!!! RESET TOKEN (dùng để test): ${options.resetToken}`); 
    console.log('--- KẾT THÚC MÔ PHỎNG ---');
};

module.exports = sendEmail;