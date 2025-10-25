// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Thêm các route từ Hoạt động 2 (Profile)
// router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

// Hoạt động 3: API Quản lý User (Admin)
// GET /api/users - Lấy tất cả user (Chỉ Admin) 
router.route('/')
  .get(protect, isAdmin, getUsers);

// DELETE /api/users/:id - Xóa user (Chỉ Admin) 
router.route('/:id')
  .delete(protect, isAdmin, deleteUser);

module.exports = router;