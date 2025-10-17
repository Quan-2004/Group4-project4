// backend/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users - Lấy tất cả users
router.get('/users', userController.getUsers);

// POST /api/users - Tạo user mới
router.post('/users', userController.createUser);

// PUT /api/users/:id - Cập nhật user theo ID
router.put('/users/:id', userController.updateUser);

// DELETE /api/users/:id - Xóa user theo ID
router.delete('/users/:id', userController.deleteUser);

module.exports = router;