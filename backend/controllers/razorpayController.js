const asyncHandler = require('../middleware/asyncHandler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_nLQYAWuOKvzENb',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret'
});

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay
// @access  Private
exports.createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  // Validate amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid amount. Amount must be greater than 0' 
    });
  }

  // Amount should be in smallest currency unit (paise for INR)
  const amountInPaise = Math.round(amount * 100);

  const options = {
    amount: amountInPaise,
    currency,
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1 // Auto-capture payment
  };

  try {
    const response = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      id: response.id,
      amount: response.amount,
      currency: response.currency
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Razorpay order',
      error: error.message
    });
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-razorpay
// @access  Private
exports.verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  // Validate required fields
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Missing required payment verification parameters'
    });
  }

  // Create signature verification string
  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret');
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  // Verify signature
  if (digest !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment signature'
    });
  }

  // Payment is valid, update order status
  try {
    // Find order by Razorpay order ID and update status
    // This assumes you've stored the Razorpay order ID in your Order model
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { 
        status: 'paid',
        paymentId: razorpay_payment_id,
        paymentSignature: razorpay_signature
      },
      { new: true }
    );

    if (!order) {
      // Create a new order if not found
      // This is a simplified example - you might want to handle this differently
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully, but no matching order found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
});