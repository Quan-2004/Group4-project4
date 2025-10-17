# 🎯 Hệ Thống Quản Lý Người Dùng - Group 4 Project 4

## 📋 Giới thiệu

Ứng dụng web quản lý người dùng được phát triển với React, cho phép thêm, xem, sửa, xóa và tìm kiếm người dùng.

**Phát triển bởi:** Quan - Frontend Developer

## 🚀 Công nghệ sử dụng

- **React** 19.2.0 - Framework JavaScript
- **Axios** 1.12.2 - HTTP Client
- **React Scripts** 5.0.1 - Build tools
- **CSS3** - Styling với gradient và animations

## 📁 Cấu trúc dự án

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AddUser.jsx        # Component form thêm user
│   │   ├── AddUser.css        # Styles cho AddUser
│   │   ├── UserList.jsx       # Component danh sách user
│   │   └── UserList.css       # Styles cho UserList
│   ├── App.js                 # Component chính
│   ├── App.css                # Styles chính
│   ├── index.js               # Entry point
│   └── index.css              # Global styles
└── package.json
```

## ✨ Tính năng

### 1. Thêm người dùng (AddUser Component)
- ✅ Form nhập thông tin (Tên, Email, Số điện thoại)
- ✅ Validation dữ liệu
- ✅ Thông báo thành công/lỗi
- ✅ Reset form
- ✅ Loading state khi xử lý

### 2. Danh sách người dùng (UserList Component)
- ✅ Hiển thị danh sách dạng bảng
- ✅ Tìm kiếm theo tên, email, SĐT
- ✅ Chỉnh sửa inline
- ✅ Xóa người dùng (có confirm)
- ✅ Loading state
- ✅ Error handling
- ✅ Responsive design
- ✅ Đếm số lượng user

## 🛠️ Cài đặt và chạy

### 1. Clone repository

```bash
git clone https://github.com/Quan-2004/Group4-project4.git
cd Group4-project4/frontend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình API Backend

Hiện tại, ứng dụng sử dụng API endpoint mặc định:
```
http://localhost:5000/api/users
```

**Để thay đổi API endpoint:**

1. Mở file `src/components/AddUser.jsx`
2. Tìm và sửa dòng:
   ```javascript
   const response = await axios.post('http://localhost:5000/api/users', formData);
   ```

3. Mở file `src/components/UserList.jsx`
4. Tìm và sửa các dòng:
   ```javascript
   const response = await axios.get('http://localhost:5000/api/users');
   await axios.delete(`http://localhost:5000/api/users/${userId}`);
   await axios.put(`http://localhost:5000/api/users/${editingUser.id}`, editingUser);
   ```

### 4. Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

## 📡 API Requirements

Backend API cần cung cấp các endpoints sau:

### GET /api/users
Lấy danh sách tất cả người dùng

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "example@email.com",
    "phone": "0123456789"
  }
]
```

### POST /api/users
Thêm người dùng mới

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "example@email.com",
  "phone": "0123456789"
}
```

### PUT /api/users/:id
Cập nhật thông tin người dùng

**Request Body:**
```json
{
  "name": "Nguyễn Văn B",
  "email": "newemail@email.com",
  "phone": "0987654321"
}
```

### DELETE /api/users/:id
Xóa người dùng

## 🎨 Giao diện

- **Header**: Gradient tím đẹp mắt với tiêu đề dự án
- **Form thêm user**: Card trắng với shadow, validation thông minh
- **Bảng danh sách**: Bảng responsive với gradient header
- **Buttons**: Hiệu ứng hover và transform
- **Search**: Tìm kiếm realtime
- **Mobile responsive**: Tối ưu cho mọi thiết bị

## 🧪 Testing

Chạy tests:
```bash
npm test
```

## 🏗️ Build Production

```bash
npm run build
```

Build folder sẽ chứa các file tối ưu để deploy.

## 📝 Scripts có sẵn

- `npm start` - Chạy development server
- `npm test` - Chạy test suite
- `npm run build` - Build production
- `npm run eject` - Eject từ Create React App

## 🐛 Troubleshooting

### Lỗi kết nối API
- Kiểm tra backend server đã chạy chưa
- Xác nhận API endpoint đúng
- Kiểm tra CORS settings ở backend

### Lỗi cài đặt
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Đóng góp

Dự án phát triển bởi **Group 4 - Quan**

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết

## 📞 Liên hệ

- Repository: [Group4-project4](https://github.com/Quan-2004/Group4-project4)
- Branch: frontend

---

**Ngày phát triển:** October 17, 2025
