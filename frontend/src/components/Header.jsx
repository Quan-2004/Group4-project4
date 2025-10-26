// frontend/src/components/Header.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;

  // Hàm xử lý logout
  const logoutHandler = () => {
    // 1. XÓA TOKEN KHỎI LOCAL STORAGE
    localStorage.removeItem('userInfo');
    // 2. Chuyển về trang login
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">🎯</span>
          <span className="logo-text">Group4 Project</span>
        </div>
        <nav className="header-nav">
          {user ? (
            <>
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <span className="user-name">{user.name}</span>
                {user.role === 'Admin' && (
                  <span className="admin-badge">👑 Admin</span>
                )}
              </div>
              <button 
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                onClick={() => navigate('/profile')}
              >
                Profile
              </button>
              {user.role === 'Admin' && (
                <button 
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  onClick={() => navigate('/admin')}
                >
                  👨‍💼 Admin
                </button>
              )}
              <button 
                onClick={logoutHandler}
                className="btn-logout-header"
              >
                Đăng Xuất
              </button>
            </>
          ) : (
            <>
              <button 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                onClick={() => navigate('/login')}
              >
                Đăng Nhập
              </button>
              <button 
                className="nav-link btn-register"
                onClick={() => navigate('/register')}
              >
                Đăng Ký
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
