# 📮 Hướng Dẫn Test API với Postman - Bước 4

## 🎯 Mục tiêu
Kiểm tra các API Authentication đã hoạt động đúng chưa trước khi merge code.

---

## ⚙️ Chuẩn bị

### 1. Khởi động Backend Server
```bash
cd backend
npm run dev
```
✅ Server phải chạy ở: `http://localhost:8080`

### 2. Mở Postman
- Nếu chưa cài: Download tại https://www.postman.com/downloads/
- Hoặc dùng Postman Web: https://web.postman.com/

---

## 📝 Test 1: Đăng Ký User Mới (Sign Up)

### Cấu hình Request:
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/signup`
- **Headers**: 
  - `Content-Type`: `application/json`
- **Body** (chọn `raw` và `JSON`):
```json
{
  "name": "Test Dang",
  "email": "dang@example.com",
  "password": "123456"
}
```

### Kết quả mong đợi:
- **Status**: `201 Created`
- **Response Body**:
```json
{
  "_id": "67...",
  "name": "Test Dang",
  "email": "dang@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 📸 **CHỤP ẢNH MÀN HÌNH NÀY!**
- Chụp toàn bộ màn hình Postman
- Phải thấy rõ: URL, Method, Status 201, Response có token

---

## 🔐 Test 2: Đăng Nhập (Login)

### Cấu hình Request:
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/login`
- **Headers**: 
  - `Content-Type`: `application/json`
- **Body** (chọn `raw` và `JSON`):
```json
{
  "email": "dang@example.com",
  "password": "123456"
}
```

### Kết quả mong đợi:
- **Status**: `200 OK`
- **Response Body**:
```json
{
  "_id": "67...",
  "name": "Test Dang",
  "email": "dang@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 📸 **CHỤP ẢNH MÀN HÌNH NÀY!**
- Chụp toàn bộ màn hình Postman
- Phải thấy rõ: URL, Method, Status 200, Response có token
- **COPY TOKEN** này để test ở các bước sau (nếu có)

---

## 🚪 Test 3: Đăng Xuất (Logout)

### Cấu hình Request:
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/logout`
- **Headers**: 
  - `Content-Type`: `application/json`
- **Body**: `(không cần body)`

### Kết quả mong đợi:
- **Status**: `200 OK`
- **Response Body**:
```json
{
  "message": "Đăng xuất thành công"
}
```

### 📸 **CHỤP ẢNH MÀN HÌNH NÀY!**
- Chụp toàn bộ màn hình Postman
- Phải thấy rõ: URL, Method, Status 200, Message

---

## ❌ Test 4: Đăng Ký Email Trùng (Error Handling)

### Cấu hình Request:
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/signup`
- **Body**:
```json
{
  "name": "Test User 2",
  "email": "dang@example.com",
  "password": "654321"
}
```
*(Cùng email với Test 1)*

### Kết quả mong đợi:
- **Status**: `400 Bad Request`
- **Response Body**:
```json
{
  "message": "Email đã tồn tại"
}
```

### 📸 **CHỤP ẢNH MÀN HÌNH NÀY!**

---

## ❌ Test 5: Đăng Nhập Sai Mật Khẩu (Error Handling)

### Cấu hình Request:
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/login`
- **Body**:
```json
{
  "email": "dang@example.com",
  "password": "wrongpassword"
}
```

### Kết quả mong đợi:
- **Status**: `401 Unauthorized`
- **Response Body**:
```json
{
  "message": "Email hoặc mật khẩu không đúng"
}
```

### 📸 **CHỤP ẢNH MÀN HÌNH NÀY!**

---

## 📋 Checklist Test

- [ ] ✅ Test 1: Sign Up thành công (201 Created)
- [ ] ✅ Test 2: Login thành công (200 OK) 
- [ ] ✅ Test 3: Logout thành công (200 OK)
- [ ] ✅ Test 4: Sign Up email trùng (400 Bad Request)
- [ ] ✅ Test 5: Login sai password (401 Unauthorized)
- [ ] 📸 Đã chụp đủ 5 ảnh màn hình
- [ ] 💾 Lưu tất cả ảnh vào folder `screenshots/postman/`

---

## 🔧 Xử lý lỗi thường gặp

### Lỗi: "Cannot POST /api/auth/signup"
**Nguyên nhân**: Backend chưa chạy hoặc route chưa được đăng ký
**Giải pháp**: 
- Kiểm tra backend đã chạy chưa: `npm run dev`
- Kiểm tra file `server.js` đã có `app.use('/api/auth', authRoutes)`

### Lỗi: "connect ECONNREFUSED"
**Nguyên nhân**: Backend không chạy hoặc sai port
**Giải pháp**: 
- Chắc chắn backend đang chạy
- Kiểm tra port đúng là 8080

### Lỗi: "JWT_SECRET is not defined"
**Nguyên nhân**: Chưa có file `.env` hoặc thiếu biến
**Giải pháp**: 
- Tạo file `backend/.env`
- Thêm dòng: `JWT_SECRET=daylatukhoabimatcuaban123456`

### Lỗi: "User validation failed"
**Nguyên nhân**: Thiếu trường bắt buộc trong request
**Giải pháp**: 
- Đảm bảo body có đủ: `name`, `email`, `password`

---

## 🎉 Sau khi test xong

1. ✅ Tổng hợp tất cả screenshots
2. ✅ Báo cáo kết quả cho team
3. ✅ Nếu tất cả test PASS → Sẵn sàng merge code
4. ✅ Tạo Pull Request và review code
5. ✅ Merge vào nhánh `main`

---

**Người thực hiện**: Sinh viên 3 (Đăng) - Git Manager & Database  
**Ngày test**: $(Get-Date -Format "dd/MM/yyyy")  
**Status**: Chờ thực hiện tests
