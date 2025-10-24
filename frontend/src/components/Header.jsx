// frontend/src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo');

  // Hàm xử lý logout
  const logoutHandler = () => {
    // 1. XÓA TOKEN KHỎI LOCAL STORAGE
    localStorage.removeItem('userInfo');
    // 2. Chuyển về trang login
    navigate('/login');
  };

  return (
    <header style={{ 
      backgroundColor: '#282c34', 
      padding: '20px', 
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2 style={{ margin: 0 }}>Group4 Project</h2>
      <nav>
        {userInfo ? (
          <>
            <a href="/profile" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>
              Profile
            </a>
            <button 
              onClick={logoutHandler}
              style={{ 
                padding: '8px 15px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Đăng Xuất
            </button>
          </>
        ) : (
          <>
            <a href="/login" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>
              Đăng Nhập
            </a>
            <a href="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Đăng Ký
            </a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
