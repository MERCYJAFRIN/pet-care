// Test script to verify registration endpoint
const http = require('http');

const testData = {
  email: `testuser-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
  phone: '9876543210'
};

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': JSON.stringify(testData).length
  }
};

console.log('📤 Sending registration request to:', `http://${options.hostname}:${options.port}${options.path}`);
console.log('📝 Request data:', testData);
console.log('');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ Response received:');
    console.log('   Status:', res.statusCode, res.statusMessage);
    console.log('   Headers:', res.headers);
    console.log('   Body:', data);
    
    try {
      const parsed = JSON.parse(data);
      console.log('');
      console.log('📋 Parsed response:');
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.token) {
        console.log('');
        console.log('✅ SUCCESS! Token received. Registration working!');
        console.log('   Token:', parsed.token.substring(0, 50) + '...');
      }
    } catch (e) {
      console.log('❌ Could not parse JSON response');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

// Write data to request body
req.write(JSON.stringify(testData));
req.end();
