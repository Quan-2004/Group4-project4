# 📸 Screenshots & Demo Guide - Password Reset Feature

## 🎯 Mục Đích
Hướng dẫn chụp screenshots và demo tính năng Reset Password cho báo cáo.

---

## 📋 Danh Sách Screenshots Cần Có

### 1. Form Forgot Password ✅

**URL:** `http://localhost:3000/forgot-password`

**Nội dung cần chụp:**
- [ ] Toàn bộ form Forgot Password
- [ ] Header với tiêu đề "🔐 Quên Mật Khẩu"
- [ ] Subtitle giải thích
- [ ] Input email với placeholder
- [ ] Nút "Gửi Email Đặt Lại"
- [ ] Footer links (Đăng nhập, Đăng ký)

**States cần chụp:**
- [ ] **Empty state** - Form trống ban đầu
- [ ] **Filled state** - Đã nhập email
- [ ] **Loading state** - Đang xử lý (nút disabled, text "Đang gửi...")
- [ ] **Success state** - Hiển thị thông báo thành công màu xanh
- [ ] **Error state** - Hiển thị thông báo lỗi màu đỏ

**Tips chụp đẹp:**
```
✨ Centering: Form ở giữa màn hình
✨ Contrast: Background gradient rõ nét
✨ Highlight: Focus vào message box khi có thông báo
✨ Timing: Chụp ngay khi hiện thông báo (trước khi auto-redirect)
```

---

### 2. Form Reset Password ✅

**URL:** `http://localhost:3000/reset-password`

**Nội dung cần chụp:**
- [ ] Toàn bộ form Reset Password
- [ ] Header với tiêu đề "🔑 Đặt Lại Mật Khẩu"
- [ ] Subtitle giải thích
- [ ] Input token với hint text
- [ ] Input mật khẩu mới
- [ ] Input xác nhận mật khẩu
- [ ] Nút "Đặt Lại Mật Khẩu"
- [ ] Footer links

**States cần chụp:**
- [ ] **Empty state** - Form trống
- [ ] **Filled state** - Đã nhập đầy đủ thông tin
- [ ] **Validation error** - Mật khẩu không khớp
- [ ] **Loading state** - Đang xử lý
- [ ] **Success state** - Thành công, sắp redirect
- [ ] **Error state** - Token không hợp lệ

**URL với token (bonus):**
```
http://localhost:3000/reset-password?token=abc123def456
```
→ Chụp screenshot khi token tự động điền vào input

---

### 3. Email Nhận Token 📧

**Yêu cầu Backend đã hoàn thành**

**Nội dung cần chụp:**
- [ ] Inbox với email mới từ hệ thống
- [ ] Subject: "Đặt Lại Mật Khẩu - Group4 Project"
- [ ] Nội dung email với token
- [ ] Link reset password (nếu có)
- [ ] Thời gian nhận email

**Email clients để test:**
- Gmail (web)
- Outlook (web)
- Mobile mail app (bonus)

---

### 4. Integration với LoginPage 🔗

**URL:** `http://localhost:3000/login`

**Nội dung cần chụp:**
- [ ] Form Login với link "Quên mật khẩu?"
- [ ] Hover state trên link
- [ ] Click vào link → chuyển đến ForgotPassword page

---

### 5. Postman API Testing 🧪

**API 1: Forgot Password**

Screenshot cần có:
- [ ] Request setup:
  - Method: POST
  - URL: http://localhost:8080/api/auth/forgot-password
  - Headers: Content-Type: application/json
  - Body (raw JSON):
    ```json
    {
      "email": "test@example.com"
    }
    ```
- [ ] Response 200 Success:
  ```json
  {
    "message": "Email đặt lại mật khẩu đã được gửi!"
  }
  ```
- [ ] Response 404 Error:
  ```json
  {
    "message": "Email không tồn tại trong hệ thống"
  }
  ```

**API 2: Reset Password**

Screenshot cần có:
- [ ] Request setup:
  - Method: POST
  - URL: http://localhost:8080/api/auth/reset-password
  - Body:
    ```json
    {
      "token": "your-token-here",
      "password": "newPassword123"
    }
    ```
- [ ] Response 200 Success
- [ ] Response 400 Error (token invalid)

---

## 🎬 Demo Flow - Video/GIF

### Scenario 1: Quên Mật Khẩu (Happy Path)

**Steps:**
1. 🎬 Vào trang Login
2. 🎬 Click "Quên mật khẩu?"
3. 🎬 Điền email: test@example.com
4. 🎬 Click "Gửi Email Đặt Lại"
5. 🎬 Hiển thị loading spinner
6. 🎬 Hiển thị thông báo thành công
7. 🎬 Auto-redirect đến Reset Password (sau 3s)
8. 🎬 Check email → copy token
9. 🎬 Dán token vào form
10. 🎬 Nhập mật khẩu mới
11. 🎬 Xác nhận mật khẩu
12. 🎬 Click "Đặt Lại Mật Khẩu"
13. 🎬 Thành công → redirect đến Login
14. 🎬 Login với mật khẩu mới

**Thời lượng:** ~30 giây  
**Format:** Screen recording hoặc GIF

---

### Scenario 2: Error Handling

**Test cases:**

1. **Email không tồn tại:**
   - Nhập: wrongemail@test.com
   - Kết quả: Hiển thị error message

2. **Mật khẩu không khớp:**
   - Password: 123456
   - Confirm: 654321
   - Kết quả: "Mật khẩu xác nhận không khớp"

3. **Mật khẩu quá ngắn:**
   - Password: 12345
   - Kết quả: "Mật khẩu phải có ít nhất 6 ký tự"

4. **Token không hợp lệ:**
   - Token: invalidtoken123
   - Kết quả: "Token không hợp lệ hoặc đã hết hạn"

---

## 📱 Responsive Testing

### Desktop (1920x1080)
- [ ] Full screen screenshot
- [ ] Form centered và đẹp

### Tablet (768x1024)
- [ ] Screenshot portrait
- [ ] Form vẫn responsive

### Mobile (375x667)
- [ ] iPhone SE size
- [ ] Buttons đủ lớn để tap
- [ ] Text readable

**Tool:** Chrome DevTools → Toggle Device Toolbar

---

## 🎨 Styling Highlights để Chụp

### Gradient Backgrounds
```css
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```
→ Chụp sao cho gradient hiển thị rõ

### Animations
- Form slide-in animation
- Button hover effects
- Success/Error message fadeIn

**Tip:** Record video để bắt animations

### Icons & Emojis
- 🔐 Quên Mật Khẩu
- 🔑 Đặt Lại Mật Khẩu
- ✉️ Email
- 🎟️ Token
- 🔒 Password

→ Đảm bảo icons hiển thị đẹp trong screenshots

---

## 📊 Before & After Comparison

### Before (Không có Password Reset)
- [x] Screenshot trang Login cũ (không có link Quên mật khẩu)

### After (Đã có Password Reset)
- [x] Screenshot trang Login mới (có link Quên mật khẩu)
- [x] Screenshot 2 trang mới: ForgotPassword & ResetPassword
- [x] Screenshot flow hoàn chỉnh

---

## 🖼️ Screenshot Organization

### Folder Structure:
```
screenshots/
├── 01-forgot-password/
│   ├── empty-state.png
│   ├── filled-state.png
│   ├── loading-state.png
│   ├── success-message.png
│   └── error-message.png
├── 02-reset-password/
│   ├── empty-form.png
│   ├── with-token-url.png
│   ├── validation-error.png
│   ├── success.png
│   └── token-invalid.png
├── 03-email/
│   ├── inbox.png
│   ├── email-content.png
│   └── token-highlight.png
├── 04-postman/
│   ├── forgot-password-request.png
│   ├── forgot-password-response.png
│   ├── reset-password-request.png
│   └── reset-password-response.png
└── 05-responsive/
    ├── desktop.png
    ├── tablet.png
    └── mobile.png
```

---

## 📝 Screenshot Captions (cho báo cáo)

### Forgot Password:
```
Hình 1: Form Forgot Password - Người dùng nhập email để yêu cầu đặt lại mật khẩu
Hình 2: Thông báo thành công khi email được gửi
Hình 3: Loading state trong quá trình xử lý
```

### Reset Password:
```
Hình 4: Form Reset Password với input token và mật khẩu mới
Hình 5: Validation error khi mật khẩu không khớp
Hình 6: Thông báo thành công khi đặt lại mật khẩu
```

### Email:
```
Hình 7: Email chứa token đặt lại mật khẩu
Hình 8: Token được highlight trong email
```

### Postman:
```
Hình 9: Test API Forgot Password với Postman
Hình 10: Response thành công từ API
Hình 11: Test API Reset Password
```

---

## 🎥 Video Demo Script

### Opening (5s):
"Chào mừng đến với demo tính năng Reset Password của Group 4"

### Part 1: Forgot Password (15s):
1. "Khi người dùng quên mật khẩu..."
2. "Click vào link 'Quên mật khẩu?'"
3. "Nhập email và gửi request"
4. "Hệ thống gửi token qua email"

### Part 2: Reset Password (15s):
1. "Người dùng nhận token trong email"
2. "Truy cập trang Reset Password"
3. "Nhập token và mật khẩu mới"
4. "Xác nhận và đặt lại thành công"

### Part 3: Verification (5s):
1. "Đăng nhập với mật khẩu mới"
2. "Thành công!"

### Closing (5s):
"Tính năng Reset Password đã hoàn thành. Cảm ơn đã xem!"

**Total:** ~45 seconds

---

## ✅ Final Checklist

### Screenshots:
- [ ] Forgot Password - All states (5 ảnh)
- [ ] Reset Password - All states (5 ảnh)
- [ ] Email token (2 ảnh)
- [ ] Postman testing (4 ảnh)
- [ ] Responsive (3 ảnh)
- [ ] Integration with Login (1 ảnh)

**Total: 20 screenshots**

### Video/GIF:
- [ ] Happy path flow (30s)
- [ ] Error handling (15s)
- [ ] Responsive demo (10s)

### Documentation:
- [ ] Captions cho mỗi ảnh
- [ ] Annotations/highlights nếu cần
- [ ] Organized trong folders

---

## 💡 Pro Tips

1. **High Quality:**
   - Full HD resolution (1920x1080)
   - PNG format (không nén)
   - Clear text, không blur

2. **Consistency:**
   - Cùng browser (Chrome)
   - Cùng zoom level (100%)
   - Cùng test data

3. **Annotations:**
   - Dùng arrows để highlight
   - Red box cho errors
   - Green checkmarks cho success

4. **Timing:**
   - Chụp đúng lúc animation kết thúc
   - Success message vẫn còn hiển thị
   - Before auto-redirect

---

**Ready to capture! 📸**

**Tools gợi ý:**
- Screenshot: ShareX, Snipping Tool, Chrome DevTools
- Video: OBS Studio, Loom, QuickTime
- GIF: ScreenToGif, LICEcap
- Annotations: Snagit, Markup
