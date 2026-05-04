require('dotenv').config();
const mongoose = require('mongoose');
const { sequelize } = require('./src/models');

async function debug() {
  console.log('--- STARTING DIAGNOSTIC ---');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('MONGODB_URI defined:', !!process.env.MONGODB_URI);
  
  try {
    console.log('1. Attempting MongoDB Connection...');
    const mongoResult = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✓ MongoDB Connected:', mongoResult.connection.host);
  } catch (err) {
    console.error('✗ MongoDB Connection FAILED:', err.message);
  }

  try {
    console.log('2. Attempting Sequelize Connection...');
    await sequelize.authenticate();
    console.log('✓ Sequelize Connected');
    
    console.log('3. Attempting Sequelize Sync...');
    await sequelize.sync({ alter: true });
    console.log('✓ Sequelize Sync Completed');
  } catch (err) {
    console.error('✗ Sequelize FAILED:', err.message);
  }

  console.log('--- DIAGNOSTIC COMPLETE ---');
  process.exit(0);
}

debug();
