// frontend/src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './AuthPages.css';
import API_BASE from '../utils/api';

const ResetPasswordPage = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');

    // Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
      setMessage('❌ Mật khẩu xác nhận không khớp!');
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      setMessage('❌ Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    try {
      // Gọi API reset password với token
  const url = `${API_BASE || '/api'}/auth/reset-password/${token}`;
  const { data } = await axios.put(url, { password });
      
      setMessage(`✅ ${data.message}. Đang chuyển đến trang đăng nhập...`);
      
      // Clear form
      setToken('');
      setPassword('');
      setConfirmPassword('');

      // Chuyển đến trang login sau 2 giây
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>🔐 Reset Mật Khẩu</h1>
      
      <p className="auth-description">
        Nhập token bạn đã nhận qua email và mật khẩu mới để reset mật khẩu của bạn.
      </p>

      {message && (
        <div className={`auth-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>🎫 Token Reset</label>
          <input 
            type="text" 
            value={token} 
            onChange={(e) => setToken(e.target.value)} 
            required 
            placeholder="Nhập token từ email"
            disabled={loading}
          />
          <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px', display: 'block' }}>
            Token có hiệu lực trong 15 phút kể từ khi được gửi
          </small>
        </div>

        <div className="form-group">
          <label>🔒 Mật Khẩu Mới</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            disabled={loading}
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label>🔒 Xác Nhận Mật Khẩu</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            placeholder="Nhập lại mật khẩu mới"
            disabled={loading}
            minLength={6}
          />
        </div>

        <button 
          type="submit" 
          className="btn-submit btn-success"
          disabled={loading}
        >
          {loading ? '⏳ Đang xử lý...' : '✨ Reset Mật Khẩu'}
        </button>
      </form>

      <p className="auth-footer">
        Chưa có token? <a href="/forgot-password">Gửi lại token</a>
      </p>
      
      <p className="auth-footer">
        Quay lại <a href="/login">Đăng nhập</a>
      </p>
    </div>
  );
};

export default ResetPasswordPage;
