# Tính Năng Quản Lý Thông Tin Cá Nhân (Profile)

## 📝 Mô tả
Trang Profile cho phép người dùng xem và cập nhật thông tin cá nhân của mình, bao gồm:
- Tên
- Email
- Mật khẩu (tùy chọn)

## 🎯 Chức năng đã hoàn thành

### 1. Xem thông tin cá nhân (View Profile)
- Hiển thị tên, email, vai trò và ID của người dùng
- Giao diện đẹp mắt với gradient màu tím
- Responsive trên mọi thiết bị

### 2. Cập nhật thông tin (Update Profile)
- Form chỉnh sửa thông tin với validation
- Có thể cập nhật: Tên, Email, Mật khẩu
- Xác nhận mật khẩu khi đổi password
- Thông báo Toast khi thành công/thất bại
- Loading state khi đang xử lý

### 3. Đăng xuất (Logout)
- Xóa token khỏi localStorage
- Chuyển hướng về trang Login

## 🔧 API Backend (Đã có sẵn)

### GET /api/users/profile
**Mô tả:** Lấy thông tin profile của user đang đăng nhập

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "_id": "673b7abcdef123456789",
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "role": "user"
}
```

### PUT /api/users/profile
**Mô tả:** Cập nhật thông tin profile

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Nguyễn Văn B",
  "email": "newmail@example.com",
  "password": "newpassword123" // optional
}
```

**Response Success (200):**
```json
{
  "_id": "673b7abcdef123456789",
  "name": "Nguyễn Văn B",
  "email": "newmail@example.com",
  "role": "user"
}
```

## 📂 Files đã tạo/cập nhật

### 1. ProfilePage.jsx
**Đường dẫn:** `frontend/src/pages/ProfilePage.jsx`

**Tính năng:**
- State management cho user info và form data
- Gọi API GET /profile khi component mount
- Form chỉnh sửa với validation
- Xử lý cập nhật thông tin qua API PUT /profile
- Toast notification
- Logout functionality

### 2. ProfilePage.css
**Đường dẫn:** `frontend/src/pages/ProfilePage.css`

**Tính năng:**
- Gradient background tím đẹp mắt
- Card design với shadow và border-radius
- Animation slideIn khi load trang
- Hover effects cho các button và field
- Responsive design cho mobile
- Form styling chuyên nghiệp

## 🚀 Hướng dẫn sử dụng

### Bước 1: Khởi động Backend
```powershell
cd backend
npm install
npm start
```
Backend sẽ chạy tại: `http://localhost:8080`

### Bước 2: Khởi động Frontend
```powershell
cd frontend
npm install
npm start
```
Frontend sẽ chạy tại: `http://localhost:3000`

### Bước 3: Đăng nhập
1. Truy cập `http://localhost:3000/login`
2. Đăng nhập bằng tài khoản có sẵn hoặc đăng ký mới

### Bước 4: Truy cập Profile
1. Sau khi đăng nhập, click vào "Profile" trong Header
2. Hoặc truy cập trực tiếp: `http://localhost:3000/profile`

### Bước 5: Xem và chỉnh sửa thông tin
1. **Chế độ xem:** Hiển thị thông tin hiện tại
2. **Chế độ sửa:** Click nút "✏️ Chỉnh Sửa"
   - Nhập thông tin mới
   - Nếu muốn đổi mật khẩu, điền vào 2 trường password
   - Click "💾 Lưu thay đổi" hoặc "❌ Hủy"

## 📸 Screenshots yêu cầu

### 1. Trang Profile - Chế độ xem
![Profile View Mode](screenshots/profile-view.png)
- Hiển thị: Tên, Email, Role, ID
- Nút "Chỉnh Sửa" ở góc trên
- Nút "Đăng Xuất" ở dưới

### 2. Trang Profile - Chế độ chỉnh sửa
![Profile Edit Mode](screenshots/profile-edit.png)
- Form với các trường: Name, Email, Password, Confirm Password
- Nút "Lưu thay đổi" và "Hủy"
- Validation và thông báo lỗi

### 3. Postman test GET /api/users/profile
![Postman GET](screenshots/postman-get-profile.png)
```
GET http://localhost:8080/api/users/profile
Headers:
  Authorization: Bearer <your_token>
```

### 4. Postman test PUT /api/users/profile
![Postman PUT](screenshots/postman-put-profile.png)
```
PUT http://localhost:8080/api/users/profile
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
Body (raw JSON):
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "password": "newpass123"
}
```

## ✅ Validation

### Form validation:
- ✅ Tên không được để trống
- ✅ Email không được để trống và phải đúng format
- ✅ Password và Confirm Password phải khớp (nếu nhập)
- ✅ Hiển thị toast notification khi lỗi/thành công

### Security:
- ✅ Yêu cầu token để truy cập
- ✅ Redirect về login nếu chưa đăng nhập
- ✅ Password được hash trước khi lưu (backend)
- ✅ Token được lưu trong localStorage

## 🎨 UI/UX Features

- ✨ Gradient background đẹp mắt
- ✨ Smooth animations và transitions
- ✨ Hover effects cho interactive elements
- ✨ Loading states khi đang xử lý
- ✨ Toast notifications cho feedback
- ✨ Responsive design cho mobile/tablet
- ✨ Clean và modern design

## 🧪 Testing

### Test thủ công:
1. ✅ Xem thông tin profile
2. ✅ Cập nhật tên
3. ✅ Cập nhật email
4. ✅ Đổi mật khẩu
5. ✅ Validation các trường
6. ✅ Logout
7. ✅ Redirect khi chưa login

### Test với Postman:
1. ✅ GET /api/users/profile
2. ✅ PUT /api/users/profile (update name)
3. ✅ PUT /api/users/profile (update email)
4. ✅ PUT /api/users/profile (update password)
5. ✅ Test với token không hợp lệ (401)

## 📦 Dependencies đã sử dụng

### Frontend:
- `react` - Core library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `react-hooks` (useState, useEffect, useNavigate)

### Backend:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

## 🔐 Security Notes

- Token được lưu trong localStorage (production nên dùng httpOnly cookies)
- Password được hash với bcrypt trước khi lưu DB
- API routes được bảo vệ bằng middleware `protect`
- Validation ở cả frontend và backend

## 📌 Notes

- File `.env` đã được tạo với `DANGEROUSLY_DISABLE_HOST_CHECK=true` để fix lỗi dev server
- `react-router-dom` đã được cài đặt
- CSS được tách riêng cho ProfilePage để dễ maintain
- Component sử dụng Toast component có sẵn trong project

## 👥 Phân công

- **Sinh viên 1:** API /profile (GET, PUT) ✅ Đã hoàn thành
- **Sinh viên 2:** Trang Profile (React) ✅ Đã hoàn thành
- **Sinh viên 3:** Kiểm thử DB, merge nhánh frontend-profile

---

**Tác giả:** Sinh viên 2
**Ngày hoàn thành:** 25/10/2025
**Status:** ✅ Hoàn thành
