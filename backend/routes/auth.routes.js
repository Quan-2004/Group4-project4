const r = require('express').Router();
const c = require('../controllers/auth.controller');
r.post('/signup', c.signup);
r.post('/login', c.login);
r.post('/logout', c.logout);
r.post('/forgot-password', c.forgotPassword);
r.post('/reset-password', c.resetPassword);
module.exports = r;
