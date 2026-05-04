import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const marketplaceService = {
  getProducts: (params) => axios.get(`${API_URL}/products`, { params }),
  getProductById: (id) => axios.get(`${API_URL}/products/${id}`),
  seedProducts: () => axios.post(`${API_URL}/products/seed`),
  createOrder: (orderData) => axios.post(`${API_URL}/payments/create-product-order`, orderData, { headers: getAuthHeader() }),
  verifyPayment: (paymentData) => axios.post(`${API_URL}/payments/verify-product-payment`, paymentData, { headers: getAuthHeader() }),
  getUserOrders: () => axios.get(`${API_URL}/payments/user-orders`, { headers: getAuthHeader() }),
};
