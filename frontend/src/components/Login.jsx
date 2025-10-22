import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // State cho form fields
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State cho validation errors
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    // State cho toast notification
    const [toast, setToast] = useState(null);

    // Hàm hiển thị toast
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    // Hàm xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa error của field đang nhập
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Hàm validate form
    const validate = () => {
        const newErrors = {};

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Hàm xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            // Gọi hàm login từ AuthContext
            const result = await login(
                formData.email.trim(),
                formData.password
            );

            if (result.success) {
                showToast('🎉 Đăng nhập thành công! Đang chuyển hướng...', 'success');
                // Reset form
                setFormData({
                    email: '',
                    password: ''
                });
                // Chuyển hướng về trang chủ sau 1 giây
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                showToast(`❌ ${result.message}`, 'error');
            }
        } catch (error) {
            showToast('❌ Có lỗi xảy ra. Vui lòng thử lại!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>🔐 Đăng Nhập</h2>
                    <p>Chào mừng trở lại!</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'input-error' : ''}
                            autoComplete="email"
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    {/* Mật khẩu */}
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'input-error' : ''}
                            autoComplete="current-password"
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    {/* Submit button */}
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? '⏳ Đang xử lý...' : '🚀 Đăng Nhập'}
                    </button>
                </form>

                {/* Link đến trang signup */}
                <div className="login-footer">
                    Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
                </div>
            </div>

            {/* Toast notification */}
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

export default Login;
