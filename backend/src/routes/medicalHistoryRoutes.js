const express = require('express');
const router = express.Router({ mergeParams: true });
const medicalHistoryController = require('../controllers/medicalHistoryController');
const authMiddleware = require('../middleware/authMiddleware');

// All medical history routes are protected
router.use(authMiddleware);

// POST - Create medical history record
router.post('/', medicalHistoryController.createMedicalHistory);

// GET - Get all medical history for a pet
router.get('/', medicalHistoryController.getMedicalHistoryByPetId);

// GET - Get medical summary for a pet
router.get('/summary', medicalHistoryController.getMedicalSummary);

// GET - Get specific medical history record
router.get('/:recordId', medicalHistoryController.getMedicalHistoryById);

// GET - Get medical history by condition
router.get('/condition/:condition', medicalHistoryController.getMedicalHistoryByCondition);

// PUT - Update medical history record
router.put('/:recordId', medicalHistoryController.updateMedicalHistory);

// DELETE - Delete medical history record
router.delete('/:recordId', medicalHistoryController.deleteMedicalHistory);

module.exports = router;
