/**
 * Razorpay Configuration
 * This file handles Razorpay payment gateway setup
 */

const Razorpay = require('razorpay');

// Razorpay instance (lazy loaded)
let razorpayInstance = null;

/**
 * Get or initialize Razorpay instance
 * @returns {Razorpay|null} Razorpay instance or null if credentials not configured
 */
const getRazorpayInstance = () => {
  if (razorpayInstance) {
    return razorpayInstance;
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('⚠️ Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    return null;
  }

  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay instance initialized successfully');
    return razorpayInstance;
  } catch (error) {
    console.error('❌ Error initializing Razorpay:', error.message);
    return null;
  }
};

/**
 * Check if Razorpay is configured
 * @returns {boolean} True if Razorpay is properly configured
 */
const isRazorpayConfigured = () => {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
};

/**
 * Get Razorpay configuration details
 * @returns {Object} Configuration object
 */
const getConfig = () => {
  return {
    configured: isRazorpayConfigured(),
    keyId: process.env.RAZORPAY_KEY_ID ? 'configured' : 'missing',
    keySecret: process.env.RAZORPAY_KEY_SECRET ? 'configured' : 'missing',
    environment: process.env.NODE_ENV || 'development',
  };
};

module.exports = {
  getRazorpayInstance,
  isRazorpayConfigured,
  getConfig,
};
