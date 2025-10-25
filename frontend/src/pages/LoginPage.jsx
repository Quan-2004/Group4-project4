// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // 1. Gọi API login
      const { data } = await axios.post('http://localhost:8080/api/auth/login', { email, password });

      // 2. LƯU TOKEN VÀO LOCAL STORAGE 
      localStorage.setItem('userInfo', JSON.stringify(data));

      setMessage('Đăng nhập thành công!');
      // Chuyển đến trang Profile hoặc trang chủ
      window.location.href = '/profile'; // Giả sử bạn có trang /profile
    } catch (error) {
      setMessage(error.response?.data?.message || 'Đã có lỗi xảy ra');
    }
  };

  return (
    <div className="auth-container">
      <h1>Đăng Nhập</h1>
      {message && (
        <div className={`auth-message ${message.includes('thành công') ? 'success' : 'error'}`}>
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
          />
        </div>
        <div className="form-group">
          <label>🔒 Mật Khẩu</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Nhập mật khẩu"
          />
        </div>
        <button type="submit" className="btn-submit btn-success">
          Đăng Nhập
        </button>
      </form>
      <p className="auth-footer">
        Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
      </p>
    </div>
  );
};
export default LoginPage;
