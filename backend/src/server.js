const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');
const weightLossRoutes = require('./routes/weightLossRoutes');
const medicalHistoryRoutes = require('./routes/medicalHistoryRoutes');
const medicineScheduleRoutes = require('./routes/medicineScheduleRoutes');
const vacationDatesRoutes = require('./routes/vacationDatesRoutes');
const healthReminderRoutes = require('./routes/healthReminderRoutes');
const healthMetricsRoutes = require('./routes/healthMetricsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const NotificationScheduler = require('./services/notificationScheduler');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/vacation-dates', vacationDatesRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/doctors', doctorRoutes);

// Pet-specific sub-routes
// These routes are nested under /api/pets/:petId
app.use('/api/pets/:petId/vaccinations', vaccinationRoutes);
app.use('/api/pets/:petId/weight-loss', weightLossRoutes);
app.use('/api/pets/:petId/medical-history', medicalHistoryRoutes);
app.use('/api/pets/:petId/medicine-schedule', medicineScheduleRoutes);
app.use('/api/pets/:petId/health-reminders', healthReminderRoutes);
app.use('/api/pets/:petId/health-metrics', healthMetricsRoutes);
app.use('/api/pets/:petId/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Pet Care App API - Multi-Pet Veterinary Management System',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      pets: '/api/pets',
      appointments: '/api/appointments',
      payments: '/api/payments',
      vacationDates: '/api/vacation-dates',
      petSpecific: {
        vaccinations: '/api/pets/:petId/vaccinations',
        weightLoss: '/api/pets/:petId/weight-loss',
        medicalHistory: '/api/pets/:petId/medical-history',
        medicineSchedule: '/api/pets/:petId/medicine-schedule',
        healthReminders: '/api/pets/:petId/health-reminders',
        healthMetrics: '/api/pets/:petId/health-metrics',
        analytics: '/api/pets/:petId/analytics',
      },
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Connect to MongoDB (Optional: doesn't crash if failed)
    try {
      await connectDB();
    } catch (dbErr) {
      console.warn('⚠️ MongoDB Connection Failed. Some features like analytics may be limited.');
      console.warn('Error detail:', dbErr.message);
    }

    // Database sync (Sequelize) and server start
    await sequelize.sync();
    
    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ Database synchronized (SQLite)`);
      console.log(`✓ API available at http://localhost:${PORT}`);
      
      // Auto-seed marketplace for a professional first impression
      const productController = require('./controllers/productController');
      productController.seedProducts({}, { json: () => {} }).catch(err => console.error('Auto-seed failed:', err));
      
      // Initialize notification scheduler
      const scheduler = new NotificationScheduler();
      scheduler.initialize().catch(err => {
        console.error('✗ Failed to initialize notification scheduler:', err);
      });
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;

