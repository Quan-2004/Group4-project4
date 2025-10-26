// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Kiểm tra xem có cấu hình SMTP không
    const hasEmailConfig = process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD;

    if (hasEmailConfig) {
        // GỬI EMAIL THẬT qua SMTP
        try {
            // Tạo transporter
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail', // gmail, outlook, yahoo, etc.
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            // Cấu hình email
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
                to: options.email,
                subject: options.subject,
                text: options.message,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #667eea; text-align: center;">🔐 Reset Mật Khẩu</h2>
                            <p style="color: #333; font-size: 16px;">Xin chào,</p>
                            <p style="color: #333; font-size: 16px;">Bạn đã yêu cầu reset mật khẩu. Sử dụng token dưới đây để reset:</p>
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                                <p style="color: #2d3748; font-weight: bold; margin: 0;">Reset Token:</p>
                                <p style="color: #667eea; font-size: 18px; font-family: monospace; word-break: break-all; margin: 10px 0;">${options.resetToken}</p>
                            </div>
                            <p style="color: #e53e3e; font-size: 14px;"><strong>⚠️ Lưu ý:</strong> Token này chỉ có hiệu lực trong 15 phút.</p>
                            <p style="color: #333; font-size: 16px;">Truy cập trang reset password và nhập token trên để đặt mật khẩu mới.</p>
                            <p style="color: #718096; font-size: 14px; margin-top: 30px;">Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.</p>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                            <p style="color: #a0aec0; font-size: 12px; text-align: center;">© 2025 Group 4 Project. All rights reserved.</p>
                        </div>
                    </div>
                `
            };

            // Gửi email
            await transporter.sendMail(mailOptions);
            
            console.log('✅ Email đã được gửi thành công tới:', options.email);
            console.log('📧 Token:', options.resetToken);
        } catch (error) {
            console.error('❌ Lỗi khi gửi email:', error.message);
            // Vẫn log token ra console để có thể test trong trường hợp email lỗi
            console.log('!!! RESET TOKEN (dùng để test vì email lỗi):', options.resetToken);
        }
    } else {
        // MÔ PHỎNG GỬI EMAIL (khi chưa cấu hình SMTP)
        console.log('\n⚠️  CHƯA CẤU HÌNH EMAIL - CHỈ MÔ PHỎNG GỬI EMAIL');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 To:', options.email);
        console.log('📋 Subject:', options.subject);
        console.log('📝 Message:', options.message);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔑 RESET TOKEN (dùng để test):', options.resetToken);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('💡 Để gửi email thật, thêm vào file .env:');
        console.log('   EMAIL_SERVICE=gmail');
        console.log('   EMAIL_USERNAME=your-email@gmail.com');
        console.log('   EMAIL_PASSWORD=your-app-password');
        console.log('   EMAIL_FROM=noreply@yourapp.com\n');
    }
};

module.exports = sendEmail; 