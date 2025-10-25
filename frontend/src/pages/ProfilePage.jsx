// frontend/src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const user = localStorage.getItem('userInfo');
    if (user) {
      setUserInfo(JSON.parse(user));
    } else {
      // Nếu chưa đăng nhập, chuyển về trang login
      navigate('/login');
    }
  }, [navigate]);

  // Hàm xử lý logout
  const logoutHandler = () => {
    // 1. XÓA TOKEN KHỎI LOCAL STORAGE
    localStorage.removeItem('userInfo');
    // 2. Chuyển về trang login
    navigate('/login');
  };

  if (!userInfo) {
    return <div className="loading-text">Đang tải...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Thông Tin Profile</h1>
      <div className="profile-info">
        <strong>Tên:</strong> {userInfo.name}
      </div>
      <div className="profile-info">
        <strong>Email:</strong> {userInfo.email}
      </div>
      <div className="profile-info">
        <strong>Role:</strong> {userInfo.role || 'user'}
      </div>
      <div className="profile-info">
        <strong>Token:</strong>
        <div className="profile-token">
          {userInfo.token}
        </div>
      </div>
      <button onClick={logoutHandler} className="btn-logout">
        Đăng Xuất
      </button>
    </div>
  );
};

export default ProfilePage;
