// Simulate frontend axios call to registration endpoint
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor (like frontend does)
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log('📤 [REQUEST] Making API call...');
    console.log('   URL:', config.url);
    console.log('   Method:', config.method);
    console.log('   Data:', config.data);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('   Token added to headers');
    }
    
    return config;
  },
  error => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor (like frontend does)
axiosInstance.interceptors.response.use(
  response => {
    console.log('✅ [RESPONSE] API call successful');
    console.log('   Status:', response.status);
    console.log('   Data:', JSON.stringify(response.data, null, 2));
    return response;
  },
  error => {
    console.error('❌ [RESPONSE ERROR] API call failed');
    console.error('   Status:', error.response?.status);
    console.error('   Message:', error.response?.data?.message || error.message);
    console.error('   Data:', error.response?.data);
    return Promise.reject(error);
  }
);

// Simulate frontend authService.register
async function testRegister() {
  try {
    console.log('\n🔍 === FRONTEND REGISTRATION TEST ===\n');
    
    const formData = {
      email: 'frontend-test@example.com',
      password: 'TestPassword123!',
      firstName: 'Frontend',
      lastName: 'Test',
      phone: '9876543210'
    };

    console.log('📋 Form data:', formData);
    console.log('');

    const response = await axiosInstance.post('/auth/register', formData);

    console.log('\n✅ SUCCESS! Registration completed');
    console.log('   Token received:', response.data.token ? 'YES (length: ' + response.data.token.length + ')' : 'NO');
    console.log('   User ID:', response.data.user.id);
    console.log('   Email:', response.data.user.email);

  } catch (error) {
    console.error('\n❌ REGISTRATION FAILED');
    console.error('   Error:', error.message);
  }
}

testRegister();
