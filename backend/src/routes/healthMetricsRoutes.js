const express = require('express');
const router = express.Router({ mergeParams: true });
const healthMetricsController = require('../controllers/healthMetricsController');
const authMiddleware = require('../middleware/authMiddleware');

// All health metrics routes are protected
router.use(authMiddleware);

// POST - Create health metric record
router.post('/', healthMetricsController.createHealthMetric);

// GET - Get all health metrics for a pet
router.get('/', healthMetricsController.getHealthMetricsByPetId);

// GET - Get latest health metric
router.get('/latest', healthMetricsController.getLatestHealthMetric);

// GET - Get health metrics for date range
router.get('/range/data', healthMetricsController.getHealthMetricsDateRange);

// PUT - Update health metric
router.put('/:metricId', healthMetricsController.updateHealthMetric);

// DELETE - Delete health metric
router.delete('/:metricId', healthMetricsController.deleteHealthMetric);

module.exports = router;
