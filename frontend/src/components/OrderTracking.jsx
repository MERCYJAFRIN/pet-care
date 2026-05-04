import React, { useState, useEffect } from 'react';
import { marketplaceService } from '../services/marketplaceService';
import '../styles/marketplace.css';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await marketplaceService.getUserOrders();
      // The backend returns { success: true, orders: [...] }
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'paid': return 'status-badge paid';
      case 'shipped': return 'status-badge shipped';
      case 'delivered': return 'status-badge delivered';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge pending';
    }
  };

  const renderStatusTracker = (status) => {
    const steps = ['pending', 'paid', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status.toLowerCase());
    
    if (status.toLowerCase() === 'cancelled') {
       return (
         <div className="order-tracker cancelled">
           <p style={{ color: 'var(--danger)', fontWeight: 700 }}>This order has been cancelled.</p>
         </div>
       );
    }

    return (
      <div className="order-tracker">
        <div className="tracker-progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0}%` }}
          />
        </div>
        {steps.map((step, index) => (
          <div 
            key={step} 
            className={`tracker-step ${index <= currentIndex ? 'completed' : ''} ${index === currentIndex ? 'active' : ''}`}
          >
            <div className="step-dot"></div>
            <span className="step-label">{step}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>🐾 Fetching your purchase history...</p>
      </div>
    );
  }

  return (
    <div className="order-tracking-container animate-fade-in">
      <div className="view-header">
         <div className="header-text">
           <h2 style={{ color: '#fff' }}>My Orders</h2>
           <p className="subtitle">Track your recent marketplace purchases and their delivery status.</p>
         </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state-container card">
          <div className="empty-icon">📦</div>
          <h3>No Orders Yet</h3>
          <p>You haven't made any purchases in the marketplace yet. Explore our premium products!</p>
        </div>
      ) : (
        <div className="orders-list">
          {[...orders].reverse().map((order) => (
            <div key={order.id} className="card order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order ID: {order.orderId || order.id.toString().slice(0, 8)}</span>
                  <span className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={getStatusBadgeClass(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              {renderStatusTracker(order.status)}
              
              <div className="order-items">
                <h4>Items Ordered</h4>
                <ul>
                  {Array.isArray(order.items) ? (
                    order.items.map((item, index) => (
                      <li key={index} className="order-item-row">
                        <span>{item.quantity}x {item.name || `Product ID: ${item.productId}`}</span>
                        <span className="item-price">₹{parseFloat(item.price).toFixed(2)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="order-item-row">Data format error</li>
                  )}
                </ul>
              </div>
              
              <div className="order-footer">
                <div className="order-total">
                  <span>Total Amount</span>
                  <span className="total-price">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
