// backend/routes/user.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

router.get('/users', ctrl.getUsers);
router.post('/users', ctrl.createUser);
router.put('/users/:id', ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);

module.exports = router;
