const express = require('express');
const router = express.Router({ mergeParams: true });
const weightLossController = require('../controllers/weightLossController');
const authMiddleware = require('../middleware/authMiddleware');

// All weight loss routes are protected
router.use(authMiddleware);

// POST - Create weight record
router.post('/', weightLossController.createWeightRecord);

// GET - Get all weight records for a pet
router.get('/', weightLossController.getWeightRecordsByPetId);

// GET - Get weight trends
router.get('/trends', weightLossController.getWeightTrends);

// GET - Get specific weight record
router.get('/:recordId', weightLossController.getWeightRecordById);

// PUT - Update weight record
router.put('/:recordId', weightLossController.updateWeightRecord);

// DELETE - Delete weight record
router.delete('/:recordId', weightLossController.deleteWeightRecord);

module.exports = router;
