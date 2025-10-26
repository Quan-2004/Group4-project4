// frontend/src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      // Gọi API forgot password
      const { data } = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      
      setMessage(`✅ ${data.message}. Vui lòng kiểm tra email của bạn để lấy token reset mật khẩu.`);
      setEmail(''); // Clear form
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>🔑 Quên Mật Khẩu</h1>
      
      <p className="auth-description">
        Nhập email của bạn để nhận token reset mật khẩu. Token sẽ được gửi qua email và có hiệu lực trong 15 phút.
      </p>

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
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-submit btn-primary"
          disabled={loading}
        >
          {loading ? '⏳ Đang gửi...' : '📧 Gửi Token Reset'}
        </button>
      </form>

      <p className="auth-footer">
        Đã có token? <a href="/reset-password">Reset mật khẩu ngay</a>
      </p>
      
      <p className="auth-footer">
        Quay lại <a href="/login">Đăng nhập</a>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
