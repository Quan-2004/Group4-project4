// backend/routes/user.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

router.get('/users', ctrl.getUsers);
router.post('/users', ctrl.createUser);

module.exports = router;
