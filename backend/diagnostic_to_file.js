const fs = require('fs');
const path = require('path');

function log(msg) {
  const line = msg + '\n';
  fs.appendFileSync('diag_output.txt', line);
  console.log(msg);
}

async function debug() {
  if (fs.existsSync('diag_output.txt')) fs.unlinkSync('diag_output.txt');
  
  log('--- STARTING DIAGNOSTIC ---');
  
  try {
    require('dotenv').config();
    log('Dotenv loaded');
  } catch (e) {
    log('Error loading dotenv: ' + e.message);
  }

  log('NODE_ENV: ' + process.env.NODE_ENV);
  log('MONGODB_URI defined: ' + !!process.env.MONGODB_URI);
  
  try {
    const mongoose = require('mongoose');
    log('1. Attempting MongoDB Connection...');
    const mongoResult = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    log('✓ MongoDB Connected: ' + mongoResult.connection.host);
  } catch (err) {
    log('✗ MongoDB Connection FAILED: ' + err.message);
  }

  try {
    log('2. Attempting Sequelize Connection...');
    const { sequelize } = require('./src/models');
    await sequelize.authenticate();
    log('✓ Sequelize Connected');
    
    log('3. Attempting Sequelize Sync...');
    await sequelize.sync({ alter: true });
    log('✓ Sequelize Sync Completed');
  } catch (err) {
    log('✗ Sequelize FAILED: ' + err.message);
  }

  log('--- DIAGNOSTIC COMPLETE ---');
  process.exit(0);
}

debug().catch(e => {
  log('FATAL ERROR: ' + e.message);
  log(e.stack);
  process.exit(1);
});
