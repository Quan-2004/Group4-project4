import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Tạo Context để chia sẻ authentication state trong toàn bộ app
const AuthContext = createContext(null);

// URL của backend API - có thể override bằng biến môi trường
const API_URL = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/$/, '')) || 'http://localhost:8080/api';

// Custom hook để dễ dàng sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Provider component để wrap toàn bộ app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Khi component mount, kiểm tra xem có token trong localStorage không
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Set default Authorization header cho tất cả request axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    // Hàm đăng ký - Sign Up
    const signup = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, {
                name,
                email,
                password
            });

            // Nếu backend trả về token ngay khi đăng ký (auto login)
            if (response.data.token) {
                const { token: newToken, user: newUser } = response.data;
                setToken(newToken);
                setUser(newUser);
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            }

            return { success: true, data: response.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng ký thất bại';
            return { success: false, message };
        }
    };

    // Hàm đăng nhập - Login
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            const { token: newToken, user: newUser } = response.data;
            
            // Lưu token và user vào state và localStorage
            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));
            
            // Set default Authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return { success: true, data: response.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            return { success: false, message };
        }
    };

    // Hàm đăng xuất - Logout
    const logout = () => {
        // Xóa token và user khỏi state và localStorage
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    // Hàm kiểm tra xem user đã đăng nhập chưa
    const isAuthenticated = () => {
        return !!token && !!user;
    };

    const value = {
        user,
        token,
        loading,
        signup,
        login,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
