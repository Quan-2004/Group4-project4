import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component để bảo vệ các route chỉ dành cho user đã đăng nhập
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Nếu đang loading, hiển thị loading spinner
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '24px'
            }}>
                ⏳ Đang tải...
            </div>
        );
    }

    // Nếu chưa đăng nhập, chuyển hướng về trang login
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Nếu đã đăng nhập, hiển thị children
    return children;
};

export default ProtectedRoute;
