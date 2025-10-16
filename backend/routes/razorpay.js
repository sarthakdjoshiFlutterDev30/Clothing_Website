const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/razorpayController');
const { protect } = require('../middleware/auth');

// Create Razorpay order
router.post('/create-razorpay', protect, createRazorpayOrder);

// Verify Razorpay payment
router.post('/verify-razorpay', protect, verifyRazorpayPayment);

module.exports = router;