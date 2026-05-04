import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/payment.css';

const RazorpayPayment = ({ appointmentId, amount, description, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Create order on backend
      const response = await api.post('/payments/create-order', {
        appointmentId,
        amount,
        description: description || 'Appointment booking fee',
      });

      if (!response.data.orderId) {
        throw new Error('Failed to create order');
      }

      setOrderId(response.data.orderId);

      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5MMOk78qrVr',
        amount: amount * 100,
        currency: 'INR',
        name: 'Pet Care - Veterinary Services',
        description: description || 'Appointment booking payment',
        order_id: response.data.orderId,
        handler: handlePaymentSuccess,
        prefill: {
          contact: localStorage.getItem('userPhone') || '',
          email: localStorage.getItem('userEmail') || '',
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err.response?.data?.message || 'Failed to initiate payment');
      if (onPaymentError) onPaymentError(err);
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setLoading(true);

      // Verify payment on backend
      const verifyResponse = await api.post('/payments/verify', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        appointmentId,
      });

      if (verifyResponse.data.success) {
        setPaymentStatus('success');
        if (onPaymentSuccess) onPaymentSuccess(verifyResponse.data);
        // Show success message
        setTimeout(() => {
          alert('Payment successful! Your appointment has been confirmed.');
        }, 500);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      setPaymentStatus('failed');
      setError('Payment verification failed. Please contact support.');
      if (onPaymentError) onPaymentError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="razorpay-payment">
      <div className="payment-card">
        <h3>Appointment Payment</h3>

        {paymentStatus === 'success' ? (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h4>Payment Successful!</h4>
            <p>Your appointment has been confirmed and paid.</p>
            <p className="amount">Amount paid: ₹{amount}</p>
          </div>
        ) : (
          <>
            <div className="payment-details">
              <div className="detail-row">
                <span className="label">Amount</span>
                <span className="value">₹{amount}</span>
              </div>
              <div className="detail-row">
                <span className="label">Description</span>
                <span className="value">{description || 'Appointment Fee'}</span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              className="pay-button"
              onClick={initiatePayment}
              disabled={loading || paymentStatus === 'success'}
            >
              {loading ? 'Processing...' : `Pay ₹${amount} with Razorpay`}
            </button>

            <p className="payment-info">
              <strong>Secure Payment:</strong> Your payment is processed securely through Razorpay.
              We accept all major credit cards, debit cards, and digital wallets.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RazorpayPayment;
