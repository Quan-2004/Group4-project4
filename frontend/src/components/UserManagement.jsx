import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserList from './UserList';
import AddUser from './AddUser';
import Toast from './Toast';
import './UserManagement.css';

// Định nghĩa URL của backend
const API_URL = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/$/, '')) || 'http://localhost:8080/api';

const UserManagement = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/users`);
                const normalized = response.data.map(u => ({ ...u, id: u._id }));
                setUsers(normalized);
            } catch (error) {
                console.error("Lỗi khi tải danh sách người dùng:", error);
                showToast('❌ Không thể tải danh sách người dùng', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleUserAdded = async (newUser) => {
        try {
            const response = await axios.post(`${API_URL}/users`, newUser);
            const created = { ...response.data, id: response.data._id };
            setUsers(prev => [created, ...prev]);
            showToast('✨ Thêm người dùng thành công!', 'success');
        } catch (error) {
            console.error("Lỗi khi thêm người dùng:", error);
            showToast('❌ Không thể thêm người dùng. Vui lòng thử lại!', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${API_URL}/users/${userId}`);
            setUsers(prev => prev.filter(user => user.id !== userId));
            showToast('🗑️ Đã xóa người dùng thành công!', 'success');
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            showToast('❌ Không thể xóa người dùng. Vui lòng thử lại!', 'error');
        }
    };

    const handleUpdateUser = async (userId, updatedUser) => {
        try {
            const response = await axios.put(`${API_URL}/users/${userId}`, updatedUser);
            const updated = { ...response.data, id: response.data._id };
            setUsers(prev => prev.map(user => user.id === userId ? updated : user));
            showToast('✏️ Cập nhật người dùng thành công!', 'success');
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            showToast('❌ Không thể cập nhật người dùng. Vui lòng thử lại!', 'error');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="user-management">
            {/* Header với thông tin user và nút logout */}
            <div className="um-header">
                <div className="um-header-content">
                    <button 
                        className="btn-back"
                        onClick={() => navigate('/')}
                    >
                        ← Trang Chủ
                    </button>
                    <h1>🎯 Quản Lý Người Dùng</h1>
                    <div className="um-user-info">
                        <span className="um-user-name">👤 {user?.name}</span>
                        <button 
                            className="btn-logout"
                            onClick={handleLogout}
                        >
                            🚪 Đăng Xuất
                        </button>
                    </div>
                </div>
            </div>

            {/* Toolbar với search */}
            <div className="um-toolbar">
                <div className="search-wrap">
                    <input
                        aria-label="Tìm kiếm người dùng"
                        className="search-input"
                        placeholder="Tìm theo tên hoặc email..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                {loading && (
                    <div className="spinner" aria-hidden="true"></div>
                )}
            </div>

            {/* Nội dung chính */}
            <div className="um-container">
                <AddUser onUserAdded={handleUserAdded} />
                <UserList 
                    users={users.filter(u => {
                        if (!query.trim()) return true;
                        const q = query.toLowerCase();
                        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                    })} 
                    onDeleteUser={handleDeleteUser}
                    onUpdateUser={handleUpdateUser}
                />
            </div>
            
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default UserManagement;
