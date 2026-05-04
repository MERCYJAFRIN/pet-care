const http = require('http');

function testAPI() {
  const path = process.argv[2] || '/api/health';
  
  const req = http.get(`http://localhost:5000${path}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('Error:', err.code);
    process.exit(1);
  });

  setTimeout(() => {
    console.error('Connection timeout');
    process.exit(1);
  }, 3000);
}

testAPI();
