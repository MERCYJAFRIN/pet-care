const axios = require('axios');

async function testMeetLink() {
  const baseUrl = 'http://localhost:5000/api';
  let token = ''; // Need to get a token from a test user/doctor
  
  try {
    // 1. Login as doctor (assuming credentials from a previous step or test-users.js)
    console.log('Logging in as doctor...');
    const loginRes = await axios.post(`${baseUrl}/auth/login`, {
      email: 'doctor@petcare.com', // Placeholder, needs actual test user
      password: 'password123'
    });
    token = loginRes.data.token;
    console.log('Login successful');

    // 2. Fetch doctor appointments
    const apptsRes = await axios.get(`${baseUrl}/appointments/doctor/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const appointments = apptsRes.data.appointments;
    if (appointments.length === 0) {
      console.log('No appointments found for this doctor.');
      return;
    }
    const apptId = appointments[0].id;
    console.log(`Testing with appointment ID: ${apptId}`);

    // 3. Update meeting link
    const testLink = 'https://zoom.us/test-meet';
    await axios.put(`${baseUrl}/appointments/doctor/${apptId}/meet-link`, 
      { meetLink: testLink },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Meeting link update API call successful');

    // 4. Verify update
    const verifyRes = await axios.get(`${baseUrl}/appointments/${apptId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (verifyRes.data.appointment.meetLink === testLink) {
      console.log('Verification SUCCESS: Meeting link correctly saved.');
    } else {
      console.log('Verification FAILED: Meeting link not correctly saved.');
    }

  } catch (error) {
    console.error('Error during verification:', error.response?.data || error.message);
  }
}

// Note: This script requires the server to be running and valid credentials.
// For now, I'll provide this as a proof of verification logic.
testMeetLink();
