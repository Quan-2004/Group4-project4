// frontend/src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      
      setMessage(`✅ ${data.message || 'Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.'}`);
      
      // Hiển thị thông báo trong 3 giây trước khi chuyển đến trang reset password
      setTimeout(() => {
        navigate('/reset-password');
      }, 3000);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="forgot-password-header">
        <h1>🔐 Quên Mật Khẩu</h1>
        <p className="forgot-password-subtitle">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </p>
      </div>

      {message && (
        <div className={`auth-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>✉️ Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="example@email.com"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Đang gửi...' : '📧 Gửi Email Đặt Lại'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Nhớ mật khẩu? <a href="/login">Đăng nhập ngay</a>
        </p>
        <p>
          Chưa có tài khoản? <a href="/register">Đăng ký</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
