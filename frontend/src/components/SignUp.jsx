import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';
import './SignUp.css';

const SignUp = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    // State cho form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        // Validate name
        if (!formData.name.trim()) {
            newErrors.name = 'Tên không được để trống';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Tên phải có ít nhất 2 ký tự';
        }

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        // Validate confirm password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
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
            // Gọi hàm signup từ AuthContext
            const result = await signup(
                formData.name.trim(),
                formData.email.trim(),
                formData.password
            );

            if (result.success) {
                showToast('🎉 Đăng ký thành công! Đang chuyển hướng...', 'success');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                // Chuyển hướng về trang chủ sau 1.5 giây
                setTimeout(() => {
                    navigate('/');
                }, 1500);
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
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h2>🎯 Đăng Ký Tài Khoản</h2>
                    <p>Tạo tài khoản mới để bắt đầu</p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                    {/* Tên */}
                    <div className="form-group">
                        <label htmlFor="name">Họ và tên</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Nhập họ và tên"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && <div className="error-message">{errors.name}</div>}
                    </div>

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
                            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'input-error' : ''}
                        />
                        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                    </div>

                    {/* Submit button */}
                    <button 
                        type="submit" 
                        className="signup-btn"
                        disabled={loading}
                    >
                        {loading ? '⏳ Đang xử lý...' : '✨ Đăng Ký'}
                    </button>
                </form>

                {/* Link đến trang login */}
                <div className="signup-footer">
                    Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
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

export default SignUp;
