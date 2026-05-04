import React, { useState, useEffect } from 'react';
import { marketplaceService } from '../services/marketplaceService';
import { paymentService, notificationService } from '../services/authService';
import OrderTracking from './OrderTracking';
import '../styles/marketplace.css';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState('shop'); // 'shop' or 'orders'
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [addedItems, setAddedItems] = useState({}); // Tracking added feedback

  useEffect(() => {
    fetchProducts();
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await marketplaceService.getProducts({ category });
      setProducts(res.data.products || []);
    } catch (err) {
      setError('Marketplace connection issue. We were unable to fetch the current product catalog.');
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Provide visual feedback instead of opening cart immediately
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setShowShippingModal(false);
    initiateRazorpay();
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowShippingModal(true);
  };

  const initiateRazorpay = async () => {
    try {
      const orderRes = await marketplaceService.createOrder({
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        totalAmount: cartTotal,
        address: `${shippingDetails.fullName}, ${shippingDetails.phone}, ${shippingDetails.address}, ${shippingDetails.city} - ${shippingDetails.pincode}`
      });

      const { orderId, amount, currency, dbOrderId } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'PetCare - Premium Store',
        description: `Order for ${cart.length} items • Premium Supplies`,
        image: 'https://cdn-icons-png.flaticon.com/512/3514/3514491.png',
        order_id: orderId,
        handler: async (response) => {
          try {
            await marketplaceService.verifyPayment({
              ...response,
              dbOrderId
            });
            setCart([]);
            setIsCartOpen(false);
            alert('🎉 Order Placed Successfully! Your pet is excited! 🐾');
            setViewMode('orders');
          } catch (err) {
            alert('❌ Payment verification failed.');
          }
        },
        prefill: {
          name: shippingDetails.fullName,
          contact: shippingDetails.phone || '',
          email: JSON.parse(localStorage.getItem('user') || '{}').email || '',
        },
        theme: { color: '#6366f1' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Failed to initiate checkout.');
    }
  };

  const categories = ['Food', 'Toys', 'Accessories', 'Health', 'Grooming'];

  return (
    <div className="marketplace-view animate-fade-in">
      <div className="view-header">
        <div className="header-text">
          <h1>Pet Marketplace</h1>
          <p className="subtitle">Premium supplies for your beloved companions.</p>
        </div>
        <div className="header-actions">
          <button className="cart-toggle-btn" onClick={() => setIsCartOpen(true)}>
            <span className="cart-icon">🛒</span>
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
          <div className="marketplace-tabs">
            <button 
              className={`tab-btn ${viewMode === 'shop' ? 'active' : ''}`}
              onClick={() => setViewMode('shop')}
            >
              Shop
            </button>
            <button 
              className={`tab-btn ${viewMode === 'orders' ? 'active' : ''}`}
              onClick={() => setViewMode('orders')}
            >
              My Orders
            </button>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="cart-sidebar-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-sidebar animate-slide-in-right" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Shopping Cart 🐾</h2>
              <button className="close-cart" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <span className="empty-cart-icon">🛒</span>
                  <p>Your cart is empty.</p>
                  <button className="btn-primary" onClick={() => setIsCartOpen(false)}>Start Shopping</button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item animate-fade-in">
                    <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <div className="cart-item-pricing">
                        <span className="unit-price">₹{item.price}</span>
                        <span className="qty-multiplier">× {item.quantity}</span>
                        <span className="item-subtotal">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                      <div className="cart-item-qty">
                        <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                    </div>
                    <button className="remove-item" onClick={() => removeFromCart(item.id)}>🗑️</button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-breakdown">
                  <div className="breakdown-row">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Shipping</span>
                    <span className="free">FREE</span>
                  </div>
                </div>
                <div className="cart-total-premium">
                  <div className="total-label">
                    <span>Total Amount</span>
                    <p className="inclusive-tax">Inclusive of all taxes</p>
                  </div>
                  <span className="total-value">₹{cartTotal.toLocaleString()}</span>
                </div>
                <button className="btn-primary checkout-btn-premium" onClick={handleCheckout}>
                  <span>Secure Checkout</span>
                  <span className="checkout-total">₹{cartTotal.toLocaleString()}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'orders' ? (
        <OrderTracking />
      ) : (
        <>
          <div className="category-actions">
            <div className="category-chips">
              <button className={`chip ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>All</button>
              {categories.map(c => (
                <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>🐾 Stocking the shelves with premium care...</p>
            </div>
          ) : (
            <div className="marketplace-content">
              {error ? (
                <div className="empty-state-container error-state card">
                  <div className="empty-icon">🔌</div>
                  <h3>Stock Synchronization Interrupted</h3>
                  <p>{error}</p>
                  <button className="btn-primary" onClick={fetchProducts}>Retry Connection</button>
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state-container card">
                  <div className="empty-icon">🛒</div>
                  <h3>No items in this aisle!</h3>
                  <p>We're currently restocking our {category} section. Check back soon!</p>
                  <button className="btn-secondary" onClick={() => setCategory('')}>Reset Filters</button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(product => (
                    <div key={product.id} className="card product-card">
                      <div className="product-image-wrapper">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                        {product.isFeatured && <span className="featured-tag">★ Featured</span>}
                        <button className="wishlist-btn">♥</button>
                      </div>
                      
                      <div className="product-details">
                        <div className="product-meta">
                          <span className="category-tag">{product.category}</span>
                          <div className="rating">
                            <span className="star">★</span>
                            <span>{product.rating || '4.5'}</span>
                          </div>
                        </div>
                        
                        <h3>{product.name}</h3>
                        <p className="description">{product.description}</p>
                        
                        <div className="product-purchase">
                          <div className="price-tag">
                            <span className="currency">₹</span>
                            <span className="amount">{Math.floor(product.price)}</span>
                            <span className="decimals">.{ (product.price % 1).toFixed(2).split('.')[1] || '00' }</span>
                          </div>
                          <button 
                            className={`buy-btn ${addedItems[product.id] ? 'added' : ''}`} 
                            onClick={() => addToCart(product)}
                            disabled={addedItems[product.id]}
                          >
                            <span>{addedItems[product.id] ? 'Added to Cart' : 'Add to Cart'}</span>
                            <span className="btn-icon">{addedItems[product.id] ? '✓' : '+'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Shipping Details Modal */}
      {showShippingModal && (
        <div className="shipping-modal-overlay">
          <div className="shipping-modal animate-scale-up">
            <div className="shipping-header">
              <h2>Shipping Details 🚚</h2>
              <p>Where should we send your pet's treats?</p>
            </div>
            <form onSubmit={handleShippingSubmit} className="shipping-form-premium">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Recipient Name"
                  value={shippingDetails.fullName}
                  onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                />
              </div>
              <div className="form-row-nested">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="10-digit number"
                    value={shippingDetails.phone}
                    onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="600001"
                    value={shippingDetails.pincode}
                    onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Full Address</label>
                <textarea 
                  required 
                  placeholder="Street, Landmark, Apartment"
                  rows="3"
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Chennai"
                  value={shippingDetails.city}
                  onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowShippingModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-glow">Proceed to Payment (₹{cartTotal.toLocaleString()})</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
