// frontend/src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
import './ProfilePage.css';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // State cho upload avatar
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://i.ibb.co/4pDNDk1/avatar.png');
  
  // Form data cho chế độ chỉnh sửa
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  // Lấy thông tin profile từ backend
  useEffect(() => {
    const fetchProfile = async () => {
      const user = localStorage.getItem('userInfo');
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { token } = JSON.parse(user);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Gọi API GET /api/users/profile
        const { data } = await axios.get('http://localhost:8080/api/users/profile', config);
        
        setUserInfo(data);
        
        // Cập nhật avatar URL nếu có
        if (data.avatar && data.avatar.url) {
          setAvatarUrl(data.avatar.url);
        }
        
        setFormData({
          name: data.name,
          email: data.email,
          password: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Lỗi khi lấy profile:', error);
        showToast('Không thể tải thông tin profile', 'error');
        
        // Nếu token hết hạn hoặc không hợp lệ
        if (error.response?.status === 401) {
          localStorage.removeItem('userInfo');
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: userInfo.name,
      email: userInfo.email,
      password: '',
      confirmPassword: ''
    });
  };

  // Lưu thay đổi
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.name.trim()) {
      showToast('Tên không được để trống', 'error');
      return;
    }

    if (!formData.email.trim()) {
      showToast('Email không được để trống', 'error');
      return;
    }

    // Nếu có nhập password, kiểm tra khớp
    if (formData.password && formData.password !== formData.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      // Chuẩn bị data để gửi
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      // Chỉ gửi password nếu user có nhập
      if (formData.password) {
        updateData.password = formData.password;
      }

      // Gọi API PUT /api/users/profile
      const { data } = await axios.put(
        'http://localhost:8080/api/users/profile',
        updateData,
        config
      );

      // Cập nhật userInfo trong state và localStorage
      const updatedUserInfo = {
        ...user,
        name: data.name,
        email: data.email,
        role: data.role
      };

      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setUserInfo(data);
      setIsEditing(false);
      
      // Reset password fields
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });

      showToast('Cập nhật thông tin thành công!', 'success');
    } catch (error) {
      console.error('Lỗi khi cập nhật profile:', error);
      showToast(
        error.response?.data?.message || 'Không thể cập nhật thông tin',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý logout
  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  // Hàm xử lý upload avatar
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Chỉ chấp nhận file ảnh (JPG, JPEG, PNG)', 'error');
      return;
    }

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Kích thước file không được vượt quá 5MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);

    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      };

      // Gọi API upload avatar
      const { data } = await axios.put(
        'http://localhost:8080/api/users/profile/avatar',
        formData,
        config
      );

      // Cập nhật avatar URL trên UI
      setAvatarUrl(data.avatar.url);
      
      // Cập nhật userInfo với avatar mới
      const updatedUserInfo = {
        ...user,
        avatar: data.avatar
      };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

      showToast('Upload avatar thành công!', 'success');
    } catch (error) {
      console.error('Lỗi khi upload avatar:', error);
      showToast(
        error.response?.data?.message || 'Không thể upload ảnh',
        'error'
      );
    } finally {
      setUploading(false);
    }
  };

  if (!userInfo) {
    return <div className="loading-text">Đang tải...</div>;
  }

  return (
    <div className="profile-page">
      {toast.show && <Toast message={toast.message} type={toast.type} />}
      
      <div className="profile-container">
        <div className="profile-header">
          <h1>Thông Tin Cá Nhân</h1>
          {!isEditing && (
            <button 
              className="btn-edit"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Chỉnh Sửa
            </button>
          )}
        </div>

        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-container">
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="profile-avatar"
            />
            {uploading && <div className="avatar-loading">Đang upload...</div>}
          </div>
          
          <div className="avatar-upload">
            <label htmlFor="avatar-input" className="btn-upload-avatar">
              📷 {uploading ? 'Đang tải lên...' : 'Đổi Avatar'}
            </label>
            <input 
              type="file" 
              id="avatar-input"
              accept="image/jpeg,image/jpg,image/png" 
              onChange={uploadFileHandler}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <p className="avatar-hint">JPG, JPEG hoặc PNG (Tối đa 5MB)</p>
          </div>
        </div>

        {!isEditing ? (
          // Chế độ xem
          <div className="profile-view">
            <div className="profile-field">
              <label>Tên:</label>
              <p>{userInfo.name}</p>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <p>{userInfo.email}</p>
            </div>
            <div className="profile-field">
              <label>Vai trò:</label>
              <p className="role-badge">{userInfo.role || 'user'}</p>
            </div>
            <div className="profile-field">
              <label>ID:</label>
              <p className="user-id">{userInfo._id}</p>
            </div>
          </div>
        ) : (
          // Chế độ chỉnh sửa
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Tên:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu mới (để trống nếu không đổi):</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-save"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                ❌ Hủy
              </button>
            </div>
          </form>
        )}

        <div className="profile-footer">
          <button onClick={logoutHandler} className="btn-logout">
            🚪 Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
