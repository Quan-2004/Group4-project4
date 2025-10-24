# Hướng dẫn Frontend Authentication - Sinh viên 2 (Quân)

## 📋 Tổng quan
Đã hoàn thành xây dựng giao diện Frontend cho chức năng Authentication (Đăng ký, Đăng nhập, Đăng xuất).

## ✅ Các tác vụ đã hoàn thành

### 1. Cài đặt Dependencies
```bash
npm install axios react-router-dom
```

### 2. Cấu hình Proxy
- File `frontend/package.json` đã có proxy: `http://localhost:8080`
- Proxy này giúp tránh lỗi CORS khi gọi API backend

### 3. Cấu trúc File đã tạo

#### 📁 frontend/src/pages/
- **RegisterPage.jsx**: Form đăng ký với các chức năng:
  - Input: Tên, Email, Mật khẩu
  - Gọi API POST `/api/auth/signup`
  - Hiển thị thông báo thành công/lỗi
  - Tự động chuyển đến trang login sau 2 giây

- **LoginPage.jsx**: Form đăng nhập với các chức năng:
  - Input: Email, Mật khẩu
  - Gọi API POST `/api/auth/login`
  - **LƯU TOKEN VÀO localStorage** 
  - Chuyển đến trang Profile sau khi đăng nhập thành công

- **ProfilePage.jsx**: Trang hiển thị thông tin user:
  - Lấy thông tin từ localStorage
  - Hiển thị: Tên, Email, Role, Token
  - Nút Đăng xuất (xóa token và chuyển về login)

#### 📁 frontend/src/components/
- **Header.jsx**: Component Header với:
  - Logo/Tên dự án
  - Navigation links (Profile, Đăng nhập, Đăng ký)
  - Nút Đăng xuất (hiển thị khi đã đăng nhập)
  - **Hàm logoutHandler**: Xóa token khỏi localStorage

#### 📁 frontend/src/
- **App.js**: Cấu hình React Router:
  - `/register` → RegisterPage
  - `/login` → LoginPage
  - `/profile` → ProfilePage
  - `/users` → UserManagementPage (trang cũ)
  - `/` → redirect to `/users`

## 🔑 Các chức năng chính

### 1. Đăng ký (Sign Up)
```javascript
// API Call
axios.post('/api/auth/signup', { name, email, password })
```
- Kiểm tra email trùng (backend xử lý)
- Hiển thị thông báo kết quả
- Tự động chuyển đến trang login

### 2. Đăng nhập (Login)
```javascript
// API Call
const { data } = await axios.post('/api/auth/login', { email, password });

// LƯU TOKEN
localStorage.setItem('userInfo', JSON.stringify(data));
```
- Xác thực email/password
- Nhận JWT token từ backend
- Lưu token vào localStorage
- Chuyển đến trang profile

### 3. Đăng xuất (Logout)
```javascript
// XÓA TOKEN
localStorage.removeItem('userInfo');
// Chuyển về login
navigate('/login');
```

## 🚀 Cách chạy và test

### Bước 1: Khởi động Backend
```bash
cd backend
npm start
# Backend chạy ở http://localhost:8080
```

### Bước 2: Khởi động Frontend
```bash
cd frontend
npm start
# Frontend chạy ở http://localhost:3000
```

### Bước 3: Test các tính năng
1. Truy cập `http://localhost:3000`
2. Click "Đăng ký" → Tạo tài khoản mới
3. Sau khi đăng ký thành công → Tự động chuyển đến trang Login
4. Đăng nhập với tài khoản vừa tạo
5. Xem thông tin Profile (có hiển thị token)
6. Click "Đăng xuất" → Quay về trang Login

## 📸 Screenshots cần chụp để nộp

1. **Form Đăng ký**: 
   - Giao diện form
   - Thông báo "Đăng ký thành công"
   - Thông báo lỗi (nếu email đã tồn tại)

2. **Form Đăng nhập**:
   - Giao diện form
   - Token hiển thị trong Console (F12 → Application → Local Storage)
   - Thông báo "Đăng nhập thành công"

3. **Trang Profile**:
   - Hiển thị thông tin user
   - JWT token hiển thị đầy đủ

4. **Header với nút Đăng xuất**:
   - Header khi chưa đăng nhập
   - Header khi đã đăng nhập (có nút Đăng xuất)

## 🔐 LocalStorage Structure
```json
{
  "userInfo": {
    "name": "Nguyễn Văn A",
    "email": "a@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 📝 Ghi chú quan trọng

1. **Proxy đã được cấu hình sẵn** ở port 8080 (khớp với backend)
2. **Token được lưu trong localStorage** - có thể xem qua DevTools
3. **Tất cả form đều có validation cơ bản** (required fields)
4. **Error handling đầy đủ** - hiển thị lỗi từ backend
5. **Responsive design** - giao diện đơn giản nhưng đẹp mắt

## ⚠️ Lưu ý trước khi Push lên Git

**CHƯA PUSH LÊN GIT** theo yêu cầu của bạn. Khi sẵn sàng:

```bash
# 1. Tạo nhánh mới
git checkout -b frontend-auth

# 2. Thêm các file mới
git add frontend/src/pages/
git add frontend/src/components/Header.jsx
git add frontend/src/App.js
git add frontend/package.json

# 3. Commit
git commit -m "feat: Add authentication pages (Register, Login, Profile) and logout functionality"

# 4. Push lên remote
git push origin frontend-auth

# 5. Tạo Pull Request trên GitHub
```

## 🎯 Checklist hoàn thành

- ✅ Cài đặt axios và react-router-dom
- ✅ Cấu hình proxy trong package.json
- ✅ Tạo RegisterPage với API signup
- ✅ Tạo LoginPage với lưu token
- ✅ Tạo ProfilePage hiển thị thông tin user
- ✅ Tạo Header với nút đăng xuất
- ✅ Cấu hình React Router trong App.js
- ✅ Xử lý lưu/xóa token trong localStorage
- ✅ Error handling đầy đủ
- ✅ UI responsive và user-friendly

## 📚 API Endpoints sử dụng

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/signup` | Đăng ký user mới |
| POST | `/api/auth/login` | Đăng nhập và nhận token |
| GET | `/api/users` | Lấy danh sách users (trang cũ) |

---

**Người thực hiện**: Sinh viên 2 (Quân) - Frontend Developer  
**Ngày hoàn thành**: $(Get-Date -Format "dd/MM/yyyy")  
**Status**: ✅ HOÀN THÀNH - Chờ review trước khi push lên Git
