// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  deleteUser, 
  getUserProfile, 
  updateUserProfile,
  updateUserProfileAvatar // <--- Import hàm upload avatar
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary'); // <--- Import upload middleware

// Hoạt động 2: Profile Routes (phải đặt trước /:id)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Upload Avatar Route
router.route('/profile/avatar')
  .put(protect, upload.single('avatar'), updateUserProfileAvatar);

// Hoạt động 3: API Quản lý User (Admin)
// GET /api/users - Lấy tất cả user (Chỉ Admin) 
router.route('/')
  .get(protect, isAdmin, getUsers);

// DELETE /api/users/:id - Xóa user (Chỉ Admin) 
router.route('/:id')
  .delete(protect, isAdmin, deleteUser);

module.exports = router;