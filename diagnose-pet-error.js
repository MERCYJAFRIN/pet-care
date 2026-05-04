#!/usr/bin/env node

/**
 * Pet Creation Error Diagnostic Tool
 * This tool helps identify why pet creation is failing
 * 
 * Run with: node diagnose-pet-error.js <token>
 */

const http = require('http');

const API_URL = 'http://localhost:5000/api';

function makeRequest(path, method, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 5000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function diagnose() {
  const token = process.argv[2];

  console.log('\n' + '='.repeat(60));
  console.log('🐾 Pet Creation Error Diagnostic Tool');
  console.log('='.repeat(60) + '\n');

  if (!token) {
    console.log('❌ ERROR: Token required!\n');
    console.log('How to get your token:');
    console.log('  1. Open your app in browser');
    console.log('  2. Press F12 to open DevTools');
    console.log('  3. Go to Console tab');
    console.log('  4. Run: localStorage.getItem("token")');
    console.log('  5. Copy the token (starts with "eyJ...")');
    console.log('\nUsage: node diagnose-pet-error.js <YOUR_TOKEN>\n');
    process.exit(1);
  }

  try {
    // Step 1: Check backend health
    console.log('📋 STEP 1: Checking backend health...\n');
    try {
      const health = await makeRequest('/health', 'GET');
      if (health.status === 200) {
        console.log('✅ Backend is running and responding');
        console.log('   Response:', health.data);
      } else {
        console.log(`⚠️ Backend returned status ${health.status}`);
      }
    } catch (err) {
      console.log('❌ Backend is not responding');
      console.log('   Error:', err.message);
      console.log('\n🔧 FIX: Start the backend with:');
      console.log('   cd backend');
      console.log('   npm start\n');
      return;
    }

    // Step 2: Verify token format
    console.log('\n📋 STEP 2: Checking token format...\n');
    if (token.startsWith('eyJ')) {
      console.log('✅ Token format looks valid (JWT)');
      const parts = token.split('.');
      console.log(`   Token has ${parts.length} parts (should be 3)`);
    } else {
      console.log('❌ Token format is invalid - not a JWT');
      console.log('   Token should start with "eyJ"');
      console.log('\n🔧 FIX: Get a fresh token:');
      console.log('   1. Logout from app');
      console.log('   2. Login again');
      console.log('   3. Run localStorage.getItem("token")\n');
      return;
    }

    // Step 3: Test pet creation
    console.log('\n📋 STEP 3: Testing pet creation API...\n');
    const petData = {
      name: 'TestPet',
      type: 'dog',
      breed: 'Labrador',
      age: 3,
      weight: 30,
      color: 'Brown',
      vaccinated: true,
      neutered: false,
    };

    console.log('Sending POST /api/pets with data:');
    console.log(JSON.stringify(petData, null, 2) + '\n');

    const createResponse = await makeRequest('/pets', 'POST', petData, token);

    console.log(`Response Status: ${createResponse.status}\n`);
    console.log('Response Data:');
    console.log(JSON.stringify(createResponse.data, null, 2) + '\n');

    if (createResponse.status === 201) {
      console.log('✅ Pet created successfully!\n');
      console.log('🎉 CHECK YOUR BROWSER');
      console.log('   1. Go to "My Pets" tab');
      console.log('   2. Try adding your pet "rocks" again');
      console.log('   3. It should work now!\n');
    } else if (createResponse.status === 401) {
      console.log('❌ Authentication failed (401)');
      console.log('   Your token is invalid or expired\n');
      console.log('🔧 FIX:');
      console.log('   1. Logout from app');
      console.log('   2. Clear browser cache (Ctrl+Shift+Delete)');
      console.log('   3. Login again');
      console.log('   4. Get fresh token and run this script again\n');
    } else if (createResponse.status === 400) {
      console.log('❌ Validation error (400)');
      console.log('   Your data format is invalid\n');
      console.log('🔧 CHECK:');
      console.log('   - Pet name is not empty');
      console.log('   - Pet type is from dropdown (dog, cat, bird, etc.)');
      console.log('   - All numbers are actual numbers\n');
    } else if (createResponse.status === 500) {
      console.log('❌ Server error (500)');
      console.log('   Backend encountered an error\n');
      console.log('🔧 CHECK BACKEND LOGS:');
      console.log('   Look at the terminal where you ran "npm start"');
      console.log('   for lines starting with ❌ or looking like errors\n');
    }

    // Step 4: Detailed error analysis
    if (createResponse.status !== 201) {
      console.log('📋 STEP 4: Analyzing error details...\n');
      
      if (createResponse.data.error) {
        console.log('Error message:', createResponse.data.error);
      }
      if (createResponse.data.details) {
        console.log('Error details:', JSON.stringify(createResponse.data.details, null, 2));
      }
      if (createResponse.data.message) {
        console.log('API message:', createResponse.data.message);
      }
    }

  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
    console.log('\nPossible causes:');
    console.log('  - Backend is not running');
    console.log('  - Wrong token format');
    console.log('  - Network connectivity issue\n');
  }

  console.log('='.repeat(60) + '\n');
}

diagnose().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
