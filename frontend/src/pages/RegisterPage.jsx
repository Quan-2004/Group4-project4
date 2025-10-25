// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './AuthPages.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Để hiển thị thông báo 

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(''); // Xóa thông báo cũ
    try {
      await axios.post('http://localhost:8080/api/auth/signup', { name, email, password });
      setMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      // Tự động chuyển qua trang login sau 2 giây
      setTimeout(() => {
        // Dùng history.push('/login') nếu bạn dùng react-router
        window.location.href = '/login'; 
      }, 2000);
    } catch (error) {
      // Hiển thị lỗi từ backend (vd: "Email đã tồn tại")
      setMessage(error.response?.data?.message || 'Đã có lỗi xảy ra');
    }
  };

  return (
    <div className="auth-container">
      <h1>Đăng Ký</h1>
      {message && (
        <div className={`auth-message ${message.includes('thành công') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>👤 Họ và Tên</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="Nhập họ và tên của bạn"
          />
        </div>
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
        <button type="submit" className="btn-submit">
          Đăng Ký
        </button>
      </form>
      <p className="auth-footer">
        Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
      </p>
    </div>
  );
};
export default RegisterPage;
