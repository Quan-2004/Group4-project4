const r = require('express').Router();
const auth = require('../middlewares/auth');
const c = require('../controllers/user.controller');

r.get('/me', auth(), c.getProfile);
r.put('/me', auth(), c.updateProfile);

// Admin-only:
r.get('/', auth('admin'), c.getAllUsers);
r.delete('/:id', auth('admin'), c.deleteUser);

module.exports = r;
