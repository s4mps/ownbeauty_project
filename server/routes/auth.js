const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, verify } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

// Authentication routes with rate limiting
router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// Token verification endpoint
router.get('/verify', authenticateToken, verify);

module.exports = router;
