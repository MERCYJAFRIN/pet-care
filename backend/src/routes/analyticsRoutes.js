const express = require('express');
const router = express.Router({ mergeParams: true });
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// All analytics routes are protected
router.use(authMiddleware);

// GET - Weight trend data (line chart)
router.get('/weight-trend', analyticsController.getWeightTrendData);

// GET - Temperature trend data
router.get('/temperature-trend', analyticsController.getTemperatureTrendData);

// GET - Vaccination status (radial chart)
router.get('/vaccination-status', analyticsController.getVaccinationStatus);

// GET - Medical condition analytics
router.get('/medical-conditions', analyticsController.getMedicalConditionAnalytics);

// GET - Pet health dashboard summary
router.get('/dashboard', analyticsController.getPetHealthDashboard);

// GET - Comprehensive analytics
router.get('/comprehensive', analyticsController.getComprehensiveAnalytics);

module.exports = router;
