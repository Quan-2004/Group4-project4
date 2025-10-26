// frontend/src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  
  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validation
    if (!token.trim()) {
      setMessage('❌ Vui lòng nhập token đặt lại mật khẩu');
      return;
    }

    if (password.length < 6) {
      setMessage('❌ Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('❌ Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8080/api/auth/reset-password', {
        token: token.trim(),
        password
      });
      
      setMessage(`✅ ${data.message || 'Đặt lại mật khẩu thành công!'}`);
      
      // Chuyển đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="reset-password-header">
        <h1>🔑 Đặt Lại Mật Khẩu</h1>
        <p className="reset-password-subtitle">
          Nhập mã token và mật khẩu mới của bạn
        </p>
      </div>

      {message && (
        <div className={`auth-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>🎟️ Token Đặt Lại</label>
          <input 
            type="text" 
            value={token} 
            onChange={(e) => setToken(e.target.value)} 
            required 
            placeholder="Nhập token từ email"
            disabled={isLoading}
          />
          <small className="form-hint">
            Token được gửi đến email của bạn
          </small>
        </div>

        <div className="form-group">
          <label>🔒 Mật Khẩu Mới</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
            disabled={isLoading}
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>🔐 Xác Nhận Mật Khẩu</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            placeholder="Nhập lại mật khẩu mới"
            disabled={isLoading}
            minLength="6"
          />
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Đang xử lý...' : '✓ Đặt Lại Mật Khẩu'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Nhớ mật khẩu? <a href="/login">Đăng nhập ngay</a>
        </p>
        <p>
          Chưa có token? <a href="/forgot-password">Yêu cầu đặt lại</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
