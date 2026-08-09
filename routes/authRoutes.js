const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, addAddress } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);

module.exports = router;
