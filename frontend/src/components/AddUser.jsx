import React, { useState } from 'react';
import './AddUser.css';

// Component này nhận một prop là hàm 'onUserAdded'
const AddUser = ({ onUserAdded }) => {
    // useState dùng để tạo ra các "biến trạng thái" cho component.
    // Khi giá trị của các biến này thay đổi, component sẽ được vẽ lại.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        // Ngăn trình duyệt tải lại trang khi submit form
        event.preventDefault();

        // Gọi hàm onUserAdded đã được truyền từ cha và gửi dữ liệu form đi
        onUserAdded({ name, email });

        // Xóa trống các ô input sau khi đã submit
        setName('');
        setEmail('');
    };

    return (
        <div className="add-user-container">
            <h2>Thêm Người Dùng Mới</h2>
            <form onSubmit={handleSubmit} className="add-user-form">
                <div className="form-group">
                    <label htmlFor="name">Tên người dùng</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Nhập tên người dùng"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Nhập địa chỉ email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">
                    ➕ Thêm Người Dùng
                </button>
            </form>
        </div>
    );
};

export default AddUser;