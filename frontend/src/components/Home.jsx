import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="home-container">
            <div className="home-card">
                <div className="home-header">
                    <h1>🎯 Trang Chủ</h1>
                    {isAuthenticated() ? (
                        <div className="user-welcome">
                            <p className="welcome-text">Xin chào, <strong>{user?.name}</strong>! 👋</p>
                            <p className="user-email">📧 {user?.email}</p>
                            {user?.role && (
                                <p className="user-role">
                                    🎭 Vai trò: <span className="role-badge">{user.role}</span>
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="welcome-text">Chào mừng đến với ứng dụng quản lý người dùng!</p>
                    )}
                </div>

                <div className="home-actions">
                    {isAuthenticated() ? (
                        <>
                            <button 
                                className="btn btn-primary"
                                onClick={() => navigate('/users')}
                            >
                                👥 Quản Lý Người Dùng
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={handleLogout}
                            >
                                🚪 Đăng Xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="btn btn-primary"
                                onClick={() => navigate('/login')}
                            >
                                🔐 Đăng Nhập
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => navigate('/signup')}
                            >
                                ✨ Đăng Ký
                            </button>
                        </>
                    )}
                </div>

                <div className="home-info">
                    <h3>📚 Thông Tin Dự Án</h3>
                    <ul>
                        <li>✅ Authentication cơ bản (Sign Up, Login, Logout)</li>
                        <li>✅ Quản lý JWT Token</li>
                        <li>✅ Protected Routes</li>
                        <li>✅ CRUD Người dùng</li>
                        <li>✅ Responsive Design</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
