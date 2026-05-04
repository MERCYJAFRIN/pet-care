#!/usr/bin/env node

/**
 * Pet Creation Debugger
 * Run this to test pet creation without UI
 * Usage: node debug-pet-creation.js
 */

const http = require('http');

const API_URL = 'http://localhost:5000/api';

// Test data (same as user's input)
const testPetData = {
  name: 'rocks',
  type: 'dog',
  breed: 'country dog',
  age: 8,
  weight: 6,
  color: 'white',
  vaccinated: true,
  neutered: true,
};

// Get token from user (they need to provide)
const token = process.argv[2] || '';

if (!token) {
  console.log('\n❌ ERROR: Token required!\n');
  console.log('Usage: node debug-pet-creation.js <YOUR_TOKEN>\n');
  console.log('How to get your token:');
  console.log('  1. Go to app and login');
  console.log('  2. Open DevTools (F12)');
  console.log('  3. Type in Console: localStorage.getItem("token")');
  console.log('  4. Copy the token and run this script\n');
  process.exit(1);
}

function testPetCreation() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testPetData);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/pets',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${token}`,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('\n🧪 Testing Pet Creation API\n');
  console.log('Token: ' + token.substring(0, 20) + '...\n');
  console.log('Test Data:');
  console.log(JSON.stringify(testPetData, null, 2));
  console.log('\n');

  try {
    console.log('📤 Sending POST /api/pets...\n');
    const response = await testPetCreation();

    console.log(`Status: ${response.status}\n`);
    
    try {
      const json = JSON.parse(response.body);
      console.log('Response:');
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Response (raw):');
      console.log(response.body);
    }

    if (response.status === 201) {
      console.log('\n✅ Pet created successfully!\n');
    } else if (response.status === 400) {
      console.log('\n❌ Validation Error - Check your data\n');
    } else if (response.status === 401) {
      console.log('\n❌ Authentication Error - Invalid token\n');
    } else if (response.status === 500) {
      console.log('\n❌ Server Error - Backend issue\n');
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
    console.log('\nPossible causes:');
    console.log('  - Backend is not running (check port 5000)');
    console.log('  - Network connectivity issue');
    console.log('  - Invalid token format\n');
  }
}

run();
