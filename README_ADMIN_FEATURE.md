# Tính Năng Quản Lý User (Admin)

## 📝 Mô tả
Trang Admin cho phép người dùng có quyền Admin quản lý tất cả người dùng trong hệ thống, bao gồm:
- Xem danh sách tất cả người dùng
- Xóa tài khoản người dùng
- Phân quyền RBAC (Role-Based Access Control)

## 🎯 Chức năng đã hoàn thành (Sinh viên 2 - Frontend)

### 1. Giao diện Admin Dashboard
- Hiển thị danh sách người dùng dạng bảng (table)
- Thông tin chi tiết: STT, Tên, Email, Vai trò, Ngày tạo
- Badge phân biệt Admin/User với màu sắc khác nhau
- Avatar tự động từ chữ cái đầu tên

### 2. Tìm kiếm và Lọc
- Thanh tìm kiếm real-time theo tên, email, hoặc role
- Hiển thị số lượng user được tìm thấy
- Nút làm mới danh sách

### 3. Xóa User
- Nút xóa cho từng user
- Modal xác nhận trước khi xóa
- Toast notification khi xóa thành công/thất bại
- Tự động cập nhật danh sách sau khi xóa

### 4. Kiểm tra Quyền (RBAC)
- Chỉ user có role "Admin" mới truy cập được `/admin`
- Tự động redirect về home nếu không có quyền
- Hiển thị badge "👑 Admin" trong Header cho Admin
- Link "👨‍💼 Admin" chỉ hiển thị cho Admin

### 5. UI/UX
- Giao diện đẹp mắt với gradient tím
- Responsive trên mọi thiết bị
- Animation và hover effects
- Loading state khi đang tải dữ liệu
- Error handling và thông báo rõ ràng

## 🔧 API Backend (Cần từ Sinh viên 1)

### GET /api/users
**Mô tả:** Lấy danh sách tất cả người dùng (chỉ Admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response Success (200):**
```json
[
  {
    "_id": "673b7abc123456789",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "User",
    "createdAt": "2025-10-25T10:30:00.000Z"
  },
  {
    "_id": "673b7abc987654321",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "Admin",
    "createdAt": "2025-10-20T08:15:00.000Z"
  }
]
```

**Response Error (403):**
```json
{
  "message": "Not authorized as an Admin"
}
```

### DELETE /api/users/:id
**Mô tả:** Xóa một người dùng (chỉ Admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response Success (200):**
```json
{
  "message": "User deleted",
  "user": {
    "_id": "673b7abc123456789",
    "name": "Nguyễn Văn A",
    "email": "user@example.com"
  }
}
```

**Response Error (404):**
```json
{
  "message": "User not found"
}
```

**Response Error (403):**
```json
{
  "message": "Not authorized as an Admin"
}
```

## 📂 Files đã tạo/cập nhật

### 1. AdminPage.jsx
**Đường dẫn:** `frontend/src/pages/AdminPage.jsx`

**Tính năng:**
- Component chính cho trang Admin
- State management cho users, loading, search
- Gọi API GET /users với token
- Xử lý xóa user với modal xác nhận
- Kiểm tra quyền Admin khi mount
- Toast notifications
- Table hiển thị danh sách users
- Search và filter functionality

**Code highlights:**
```jsx
// Kiểm tra quyền Admin
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user.role !== 'Admin') {
    navigate('/');
    return;
  }
  fetchUsers();
}, [navigate]);

// Xóa user với confirmation
const confirmDelete = async () => {
  await axios.delete(`/api/users/${userId}`, config);
  setUsers(users.filter(user => user._id !== userId));
};
```

### 2. AdminPage.css
**Đường dẫn:** `frontend/src/pages/AdminPage.css`

**Tính năng:**
- Gradient background tím
- Table styling chuyên nghiệp
- Role badges với màu sắc phân biệt
- Responsive design
- Hover effects và animations
- Loading spinner
- Search box styling

### 3. App.js (Cập nhật)
**Thay đổi:**
- Import AdminPage component
- Thêm route `/admin` vào Routes

```jsx
import AdminPage from './pages/AdminPage';

// ...
<Route path="/admin" element={<AdminPage />} />
```

### 4. Header.jsx (Cập nhật)
**Thay đổi:**
- Hiển thị badge "👑 Admin" cho user có role Admin
- Thêm link "👨‍💼 Admin" chỉ cho Admin
- Conditional rendering dựa trên role

```jsx
{user.role === 'Admin' && (
  <span className="admin-badge">👑 Admin</span>
)}

{user.role === 'Admin' && (
  <button onClick={() => navigate('/admin')}>
    👨‍💼 Admin
  </button>
)}
```

### 5. Header.css (Cập nhật)
**Thay đổi:**
- Style cho admin-badge
- Pulse animation cho badge

## 🚀 Hướng dẫn sử dụng

### Bước 1: Đảm bảo Backend đã có RBAC middleware
Backend cần có:
- Middleware `protect` để xác thực token
- Middleware `isAdmin` để kiểm tra role Admin
- Routes `/api/users` bảo vệ bằng cả 2 middleware

```javascript
// backend/routes/user.js
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/users', protect, isAdmin, ctrl.getUsers);
router.delete('/users/:id', protect, isAdmin, ctrl.deleteUser);
```

### Bước 2: Tạo user Admin trong database
Sử dụng MongoDB Compass hoặc script để tạo user với role "Admin":

```javascript
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "hashedpassword123", // Đã hash bằng bcrypt
  "role": "Admin"
}
```

### Bước 3: Đăng nhập với tài khoản Admin
1. Truy cập `http://localhost:3000/login`
2. Đăng nhập bằng tài khoản Admin
3. Sau khi đăng nhập, sẽ thấy badge "👑 Admin" trong Header

### Bước 4: Truy cập trang Admin
1. Click vào nút "👨‍💼 Admin" trong Header
2. Hoặc truy cập trực tiếp: `http://localhost:3000/admin`
3. Xem danh sách tất cả users

### Bước 5: Quản lý Users
1. **Tìm kiếm:** Nhập vào ô tìm kiếm để lọc users
2. **Làm mới:** Click "🔄 Làm mới" để reload danh sách
3. **Xóa user:** 
   - Click nút "🗑️ Xóa" ở hàng user muốn xóa
   - Xác nhận trong modal
   - User sẽ bị xóa khỏi database

## 📸 Screenshots yêu cầu

### 1. Trang Admin hiển thị danh sách user
![Admin Dashboard](screenshots/admin-dashboard.png)
- Table với đầy đủ thông tin user
- Badge phân biệt Admin/User
- Nút xóa cho mỗi user
- Thanh tìm kiếm và stats

### 2. Chức năng xóa user hoạt động
![Delete User Modal](screenshots/admin-delete-user.png)
- Modal xác nhận xóa
- Hiển thị tên user sẽ bị xóa
- Nút "Xác nhận" và "Hủy"

![Delete Success](screenshots/admin-delete-success.png)
- Toast notification thành công
- Danh sách tự động cập nhật

### 3. Header với Admin badge
![Admin Header](screenshots/admin-header.png)
- Badge "👑 Admin" trong user info
- Link "👨‍💼 Admin" chỉ hiển thị cho Admin

### 4. Postman test API /users với quyền Admin

**Test GET /api/users:**
```
GET http://localhost:8080/api/users
Headers:
  Authorization: Bearer <admin_token>
```
![Postman GET Users](screenshots/postman-get-users-admin.png)

**Test DELETE /api/users/:id:**
```
DELETE http://localhost:8080/api/users/673b7abc123456789
Headers:
  Authorization: Bearer <admin_token>
```
![Postman DELETE User](screenshots/postman-delete-user-admin.png)

**Test với User thường (403 Error):**
```
GET http://localhost:8080/api/users
Headers:
  Authorization: Bearer <user_token>
```
![Postman 403 Error](screenshots/postman-403-user.png)
Response:
```json
{
  "message": "Not authorized as an Admin"
}
```

## ✅ Security & Validation

### Frontend validation:
- ✅ Kiểm tra token khi mount component
- ✅ Kiểm tra role === 'Admin'
- ✅ Redirect nếu không có quyền
- ✅ Confirmation modal trước khi xóa
- ✅ Error handling cho API calls
- ✅ Token trong Authorization header

### Backend validation (cần từ SV1):
- ✅ Middleware `protect` để verify token
- ✅ Middleware `isAdmin` để check role
- ✅ Return 401 nếu token invalid
- ✅ Return 403 nếu không phải Admin
- ✅ Return 404 nếu user không tồn tại

## 🎨 UI/UX Features

### Design:
- ✨ Gradient purple background
- ✨ Professional table layout
- ✨ Color-coded role badges
- ✨ Avatar generated from name initials
- ✨ Hover effects on table rows
- ✨ Smooth animations

### Interactions:
- ✨ Real-time search filtering
- ✨ Loading states
- ✨ Confirmation modals
- ✨ Toast notifications
- ✨ Error messages
- ✨ Responsive design

### Accessibility:
- ✨ Clear visual hierarchy
- ✨ Readable font sizes
- ✨ High contrast colors
- ✨ Descriptive button labels
- ✨ Warning messages

## 🧪 Testing Checklist

### Frontend Testing:
- [ ] Đăng nhập với Admin → Thấy badge và link Admin
- [ ] Đăng nhập với User → Không thấy link Admin
- [ ] Truy cập `/admin` với Admin → Thấy trang Admin
- [ ] Truy cập `/admin` với User → Redirect về home
- [ ] Truy cập `/admin` chưa login → Redirect về login
- [ ] Xem danh sách users
- [ ] Tìm kiếm users theo tên/email/role
- [ ] Click xóa → Hiện modal xác nhận
- [ ] Xác nhận xóa → User bị xóa, toast success
- [ ] Hủy xóa → Modal đóng, user không bị xóa
- [ ] Làm mới danh sách
- [ ] Responsive trên mobile/tablet

### Postman Testing:
- [ ] GET /api/users với Admin token → 200 + danh sách users
- [ ] GET /api/users với User token → 403 error
- [ ] GET /api/users không token → 401 error
- [ ] DELETE /api/users/:id với Admin token → 200 + message
- [ ] DELETE /api/users/:id với User token → 403 error
- [ ] DELETE /api/users/invalid_id → 404 error

## 📦 Dependencies

### Frontend đã sử dụng:
- `react` - Core library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `Toast` component - Notifications (đã có sẵn)
- `ConfirmModal` component - Confirmation dialogs (đã có sẵn)

### Backend cần có (từ SV1):
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- Middleware: `protect`, `isAdmin`

## 🔐 RBAC (Role-Based Access Control)

### Roles được hỗ trợ:
1. **Admin:**
   - Xem tất cả users
   - Xóa bất kỳ user nào
   - Truy cập trang `/admin`
   - Thấy badge và menu Admin

2. **User:**
   - Chỉ xem/sửa profile của mình
   - Không truy cập được `/admin`
   - Không thấy menu Admin

### Cách hoạt động:
1. Token JWT chứa thông tin user và role
2. Frontend kiểm tra role từ localStorage
3. Backend verify token và check role trong middleware
4. API routes được bảo vệ bằng middleware stack:
   ```javascript
   router.get('/users', protect, isAdmin, getUsers);
   ```

## 📌 Notes

### Lưu ý quan trọng:
- ⚠️ Không thể tự xóa chính mình khi đang đăng nhập
- ⚠️ Hành động xóa không thể hoàn tác
- ⚠️ Nên backup database trước khi test xóa
- ⚠️ Token hết hạn sẽ tự động logout và redirect về login

### Best practices:
- ✅ Luôn hiển thị confirmation modal trước khi xóa
- ✅ Cung cấp feedback rõ ràng cho user
- ✅ Log errors để debug
- ✅ Handle tất cả error cases
- ✅ Responsive design cho mọi màn hình

## 🔄 Integration với Backend

Để tính năng hoạt động hoàn chỉnh, cần Sinh viên 1 hoàn thành:

### 1. Middleware RBAC
```javascript
// backend/middleware/authMiddleware.js
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an Admin' });
  }
};
```

### 2. Protected Routes
```javascript
// backend/routes/user.js
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/users', protect, isAdmin, ctrl.getUsers);
router.delete('/users/:id', protect, isAdmin, ctrl.deleteUser);
```

### 3. User Model với Role
```javascript
// backend/models/User.js
const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  }
});
```

## 👥 Phân công

- **Sinh viên 1:** API /users (GET, DELETE), middleware RBAC ⏳ Đang chờ
- **Sinh viên 2:** Giao diện Admin: danh sách user, nút xóa ✅ Đã hoàn thành
- **Sinh viên 3:** Kiểm thử role, merge backend-admin ⏳ Đang chờ

---

**Tác giả:** Sinh viên 2
**Ngày hoàn thành:** 25/10/2025
**Status:** ✅ Frontend hoàn thành, chờ Backend integration
