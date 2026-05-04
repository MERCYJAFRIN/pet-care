const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// All payment routes are protected
router.use(authMiddleware);

// POST - Create Razorpay order for appointment
router.post('/create-order', paymentController.createOrderForAppointment);

// POST - Verify payment signature
router.post('/verify', paymentController.verifyPayment);

// POST - Capture payment
router.post('/capture', paymentController.capturePayment);

// POST - Refund payment
router.post('/refund', paymentController.refundPayment);

// GET - Check payment status for appointment
router.get('/status/:appointmentId', paymentController.getPaymentStatus);

// GET - Payment history
router.get('/history', paymentController.getPaymentHistory);

// Marketplace product payments
router.post('/create-product-order', paymentController.createOrderForProduct);
router.post('/verify-product-payment', paymentController.verifyProductPayment);
router.get('/user-orders', paymentController.getUserOrders);

module.exports = router;
