const express = require('express');
const router = express.Router({ mergeParams: true });
const vaccinationController = require('../controllers/vaccinationController');
const authMiddleware = require('../middleware/authMiddleware');

// All vaccination routes are protected
router.use(authMiddleware);

// POST - Create vaccination record
router.post('/', vaccinationController.createVaccination);

// GET - Get all vaccinations for a pet
router.get('/', vaccinationController.getVaccinationsByPetId);

// GET - Get vaccination reminders (overdue and upcoming)
router.get('/reminders', vaccinationController.getVaccinationReminders);

// GET - Get specific vaccination record
router.get('/:vaccinationId', vaccinationController.getVaccinationById);

// PUT - Update vaccination record
router.put('/:vaccinationId', vaccinationController.updateVaccination);

// DELETE - Delete vaccination record
router.delete('/:vaccinationId', vaccinationController.deleteVaccination);

module.exports = router;
