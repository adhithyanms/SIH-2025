const express = require('express');
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  getProfile
} = require('../controllers/authController');

// Send OTP
router.post('/send-otp', sendOTP);

// Verify OTP
router.post('/verify-otp', verifyOTP);

// Get user profile
router.get('/profile/:userId', getProfile);

module.exports = router;
