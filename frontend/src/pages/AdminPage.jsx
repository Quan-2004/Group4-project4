// frontend/src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import './AdminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  // Lấy danh sách users từ backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.get('http://localhost:8080/api/users', config);
      setUsers(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách users:', error);
      showToast(
        error.response?.data?.message || 'Không thể tải danh sách người dùng',
        'error'
      );
      
      // Nếu token hết hạn
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra quyền Admin
  useEffect(() => {
    const checkAdminAccess = () => {
      const userInfo = localStorage.getItem('userInfo');
      
      if (!userInfo) {
        showToast('Vui lòng đăng nhập để truy cập', 'error');
        navigate('/login');
        return false;
      }

      const user = JSON.parse(userInfo);
      
      // Kiểm tra role Admin
      if (user.role !== 'Admin') {
        showToast('Bạn không có quyền truy cập trang này', 'error');
        navigate('/');
        return false;
      }

      return true;
    };

    if (!checkAdminAccess()) {
      return;
    }

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  // Xử lý xóa user
  const handleDeleteUser = async (userId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      await axios.delete(`http://localhost:8080/api/users/${userId}`, config);
      
      // Cập nhật danh sách users sau khi xóa thành công
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      
      showToast('🗑️ Xóa người dùng thành công!', 'success');
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Lỗi khi xóa user:', error);
      showToast(
        error.response?.data?.message || 'Không thể xóa người dùng',
        'error'
      );
      
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    }
  };

  // Hiển thị modal xác nhận xóa
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Xử lý khi xác nhận xóa
  const handleDeleteConfirmed = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete._id);
    }
  };

  // Đóng modal
  const closeModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Lọc users theo search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast}
        />
      )}

      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-title-section">
            <h1>👨‍💼 Quản Lý Người Dùng (Admin)</h1>
            <p className="admin-subtitle">Quản lý tất cả người dùng trong hệ thống</p>
          </div>
          <button className="btn-refresh" onClick={fetchUsers} disabled={loading}>
            🔄 Làm mới
          </button>
        </div>

        <div className="admin-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="stats-box">
            <span className="stats-label">Tổng số:</span>
            <span className="stats-value">{filteredUsers.length} người dùng</span>
          </div>
        </div>

        <div className="users-table-container">
          {filteredUsers.length === 0 ? (
            <div className="no-users">
              <p>Không tìm thấy người dùng nào</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="user-row">
                    <td>{index + 1}</td>
                    <td>
                      <div className="user-name-cell">
                        <span className="user-avatar-small">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                        {user.role === 'Admin' ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="user-date">
                      {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => confirmDelete(user)}
                          className="btn-delete-user"
                          title="Xóa người dùng"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-footer">
          <p className="footer-note">
            ℹ️ Trang quản lý người dùng - Có thể xóa người dùng
          </p>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={closeModal}
        onConfirm={handleDeleteConfirmed}
        userName={userToDelete?.name}
      />
    </div>
  );
};

export default AdminPage;
