// frontend/src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo');

  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Chào mừng đến với<br />
            <span className="gradient-text">Group4 Project</span>
          </h1>
          <p className="hero-subtitle">
            Hệ thống quản lý người dùng hiện đại với Authentication bảo mật
          </p>
          <div className="hero-buttons">
            {userInfo ? (
              <>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/users')}
                >
                  Quản Lý Users
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/profile')}
                >
                  Xem Profile
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/register')}
                >
                  Đăng Ký Ngay
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/login')}
                >
                  Đăng Nhập
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Tính Năng Nổi Bật</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Authentication</h3>
            <p>Đăng ký, đăng nhập an toàn với JWT Token</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Quản Lý User</h3>
            <p>Thêm, sửa, xóa người dùng dễ dàng</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Giao Diện Đẹp</h3>
            <p>UI/UX hiện đại, responsive trên mọi thiết bị</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Hiệu Năng Cao</h3>
            <p>Tối ưu hóa tốc độ và trải nghiệm người dùng</p>
          </div>
        </div>
      </section>

      <section className="tech-section">
        <h2 className="section-title">Công Nghệ Sử Dụng</h2>
        <div className="tech-stack">
          <div className="tech-item">
            <span className="tech-badge">React</span>
          </div>
          <div className="tech-item">
            <span className="tech-badge">Node.js</span>
          </div>
          <div className="tech-item">
            <span className="tech-badge">Express</span>
          </div>
          <div className="tech-item">
            <span className="tech-badge">MongoDB</span>
          </div>
          <div className="tech-item">
            <span className="tech-badge">JWT</span>
          </div>
          <div className="tech-item">
            <span className="tech-badge">bcrypt</span>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Sẵn sàng bắt đầu?</h2>
          <p>Tạo tài khoản ngay hôm nay để trải nghiệm đầy đủ tính năng</p>
          {!userInfo && (
            <button 
              className="btn btn-large"
              onClick={() => navigate('/register')}
            >
              Đăng Ký Miễn Phí
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
