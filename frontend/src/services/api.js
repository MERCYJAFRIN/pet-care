import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to headers
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');

    // Detailed logging for debugging
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'NO_TOKEN',
      allStorageKeys: Object.keys(localStorage),
    });

    if (!token) {
      console.warn('⚠️ WARNING: No token found in localStorage');
      console.log('localStorage contents:', localStorage);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request headers');
    } else {
      console.log('❌ No token available - request will fail with 401');
    }

    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Log responses
axiosInstance.interceptors.response.use(
  response => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // Auto-logout if token is invalid or expired
    if (error.response?.status === 401 && 
       (error.response?.data?.message === 'Invalid token' || error.response?.data?.message === 'No token provided')) {
      console.warn('🔒 Session invalid. Clearing local storage and redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use a timeout to allow the user to see the error briefly before reload
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
