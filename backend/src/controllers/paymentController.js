const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Appointment, Order, Product } = require('../models');

// Initialize Razorpay instance (lazy - only when credentials are available)
let razorpay = null;

const getRazorpayInstance = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// Create Razorpay Order for appointment payment
exports.createOrderForAppointment = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment service not configured. Please add Razorpay credentials to .env file.' 
      });
    }

    const { appointmentId, amount, description } = req.body;

    // Verify appointment exists and belongs to user
    const appointment = await Appointment.findOne({
      where: { id: appointmentId, userId: req.userId },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if already paid
    if (appointment.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment already completed for this appointment' });
    }

    // Create order options
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `appointment_${appointmentId}`,
      description: description || 'Appointment booking fee',
      notes: {
        appointmentId,
        userId: req.userId,
        petId: appointment.petId,
      },
    };

    // Create order on Razorpay
    const order = await razorpay.orders.create(options);

    // Update appointment with order details
    await appointment.update({
      razorpayOrderId: order.id,
      paymentStatus: 'initiated',
    });

    res.json({
      success: true,
      orderId: order.id,
      appointmentId,
      amount: order.amount,
      currency: order.currency,
      appointmentDetails: {
        veterinarian: appointment.veterinarian,
        appointmentDate: appointment.appointmentDate,
        fee: appointment.fee,
      },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      message: 'Error creating payment order',
      error: error.message,
    });
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    // Find appointment
    const appointment = await Appointment.findOne({
      where: { id: appointmentId, userId: req.userId },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Generate signature to verify payment
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const hmac = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Verify signature
    if (hmac !== razorpay_signature) {
      await appointment.update({ paymentStatus: 'failed' });
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Update appointment with payment details
    await appointment.update({
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: 'completed',
      paymentMethod: 'razorpay',
      paymentDate: new Date(),
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      appointment: {
        id: appointment.id,
        paymentStatus: appointment.paymentStatus,
        paymentDate: appointment.paymentDate,
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      message: 'Error verifying payment',
      error: error.message,
    });
  }
};

// Get payment status for appointment
exports.getPaymentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({
      where: { id: appointmentId, userId: req.userId },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      appointmentId,
      paymentStatus: appointment.paymentStatus,
      fee: appointment.fee,
      paymentMethod: appointment.paymentMethod,
      paymentDate: appointment.paymentDate,
      razorpayOrderId: appointment.razorpayOrderId,
      razorpayPaymentId: appointment.razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching payment status',
      error: error.message,
    });
  }
};

// Capture payment (after authorization)
exports.capturePayment = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment service not configured.' 
      });
    }

    const { razorpay_payment_id, appointmentId, amount } = req.body;

    const appointment = await Appointment.findOne({
      where: { id: appointmentId, userId: req.userId },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Capture payment
    await razorpay.payments.capture(razorpay_payment_id, amount * 100);

    // Update payment status
    await appointment.update({
      paymentStatus: 'completed',
      razorpayPaymentId: razorpay_payment_id,
      paymentDate: new Date(),
    });

    res.json({
      success: true,
      message: 'Payment captured successfully',
    });
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(500).json({
      message: 'Error capturing payment',
      error: error.message,
    });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment service not configured.' 
      });
    }

    const { appointmentId, reason } = req.body;

    const appointment = await Appointment.findOne({
      where: { id: appointmentId, userId: req.userId },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }

    // Create refund
    await razorpay.payments.refund(appointment.razorpayPaymentId, {
      amount: appointment.fee * 100,
      notes: {
        reason: reason || 'Appointment cancelled',
      },
    });

    // Update appointment status
    await appointment.update({
      paymentStatus: 'cancelled',
      status: 'cancelled',
    });

    res.json({
      success: true,
      message: 'Payment refunded successfully',
    });
  } catch (error) {
    console.error('Error refunding payment:', error);
    res.status(500).json({
      message: 'Error processing refund',
      error: error.message,
    });
  }
};

// Get appointment payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { userId: req.userId, paymentStatus: 'completed' },
      attributes: [
        'id',
        'veterinarian',
        'appointmentDate',
        'fee',
        'paymentStatus',
        'paymentDate',
        'paymentMethod',
      ],
      order: [['paymentDate', 'DESC']],
    });

    const totalAmount = appointments.reduce((sum, apt) => sum + parseFloat(apt.fee || 0), 0);

    res.json({
      totalPayments: appointments.length,
      totalAmount: totalAmount.toFixed(2),
      payments: appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching payment history',
      error: error.message,
    });
  }
};

// Create Razorpay Order for product purchase
exports.createOrderForProduct = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) return res.status(503).json({ message: 'Payment service not configured.' });

    const { items, totalAmount, address } = req.body;

    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: { userId: req.userId }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const order = await Order.create({
      userId: req.userId,
      totalAmount,
      address,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name || `Product #${item.productId}` // Ensure name gets saved
      })),
      orderId: razorpayOrder.id,
      status: 'pending'
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product order', error: error.message });
  }
};

// Verify Product Payment
exports.verifyProductPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    const order = await Order.findByPk(dbOrderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (hmac !== razorpay_signature) {
      await order.update({ status: 'cancelled' });
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    await order.update({
      paymentId: razorpay_payment_id,
      status: 'paid'
    });

    res.json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

// Get User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ 
      message: 'Error fetching user orders', 
      error: error.message 
    });
  }
};
