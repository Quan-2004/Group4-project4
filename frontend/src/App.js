import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import Toast from './components/Toast';
import './App.css';

// Định nghĩa URL của backend để dễ dàng thay đổi khi cần
const API_URL = "http://localhost:8080/api/users"; // Dùng port 3000 hoặc port của backend

function App() {
    // Tạo biến trạng thái 'users' để lưu trữ danh sách người dùng
    const [users, setUsers] = useState([]);
    
    // State cho toast notification
    const [toast, setToast] = useState(null);

    // Hàm hiển thị toast
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    // useEffect là một "hook" đặc biệt của React.
    // Code bên trong nó sẽ được chạy sau khi component được render lần đầu tiên.
    // Dấu ngoặc vuông [] ở cuối có nghĩa là "chỉ chạy đúng 1 lần duy nhất".
    useEffect(() => {
        // Định nghĩa một hàm để gọi API và lấy danh sách người dùng
        const fetchUsers = async () => {
            try {
                const response = await axios.get(API_URL);
                setUsers(response.data); // Cập nhật danh sách users với dữ liệu từ server
            } catch (error) {
                console.error("Lỗi khi tải danh sách người dùng:", error);
            }
        };

        fetchUsers(); // Gọi hàm đó
    }, []);

    // Hàm này sẽ được truyền xuống cho component AddUser
    const handleUserAdded = async (newUser) => {
        try {
            // Gửi dữ liệu người dùng mới lên server bằng phương thức POST
            const response = await axios.post(API_URL, newUser);
            
            // Cập nhật danh sách người dùng trên giao diện mà không cần tải lại trang
            setUsers([...users, response.data]);
            showToast('✨ Thêm người dùng thành công!', 'success');
        } catch (error) {
            console.error("Lỗi khi thêm người dùng:", error);
            showToast('❌ Không thể thêm người dùng. Vui lòng thử lại!', 'error');
        }
    };

    // Hàm xóa người dùng
    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${API_URL}/${userId}`);
            // Cập nhật danh sách bằng cách loại bỏ user đã xóa
            setUsers(users.filter(user => user.id !== userId));
            showToast('🗑️ Đã xóa người dùng thành công!', 'success');
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            showToast('❌ Không thể xóa người dùng. Vui lòng thử lại!', 'error');
        }
    };

    // Hàm cập nhật người dùng
    const handleUpdateUser = async (userId, updatedUser) => {
        try {
            const response = await axios.put(`${API_URL}/${userId}`, updatedUser);
            // Cập nhật danh sách với thông tin mới
            setUsers(users.map(user => 
                user.id === userId ? response.data : user
            ));
            showToast('✏️ Cập nhật người dùng thành công!', 'success');
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            showToast('❌ Không thể cập nhật người dùng. Vui lòng thử lại!', 'error');
        }
    };

    return (
        <div className="App">
            <h1>🎯 Quản Lý Người Dùng</h1>
            <div className="app-container">
                {/* Truyền hàm handleUserAdded xuống cho AddUser */}
                <AddUser onUserAdded={handleUserAdded} />
                {/* Truyền danh sách users và các hàm xử lý xuống cho UserList */}
                <UserList 
                    users={users} 
                    onDeleteUser={handleDeleteUser}
                    onUpdateUser={handleUpdateUser}
                />
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
}

export default App;