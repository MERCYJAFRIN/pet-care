const express = require('express');
const router = express.Router({ mergeParams: true });
const medicineScheduleController = require('../controllers/medicineScheduleController');
const authMiddleware = require('../middleware/authMiddleware');

// All medicine schedule routes are protected
router.use(authMiddleware);

// POST - Create medicine schedule
router.post('/', medicineScheduleController.createMedicineSchedule);

// GET - Get all medicine schedules for a pet
router.get('/', medicineScheduleController.getMedicineSchedulesByPetId);

// GET - Get today's medicines
router.get('/today', medicineScheduleController.getTodaysMedicines);

// GET - Get active medicines for a pet
router.get('/active', medicineScheduleController.getActiveMedicines);

// GET - Get specific medicine schedule
router.get('/:scheduleId', medicineScheduleController.getMedicineScheduleById);

// PUT - Update medicine schedule
router.put('/:scheduleId', medicineScheduleController.updateMedicineSchedule);

// PUT - Update medicine status (morning, afternoon, night)
router.put('/:scheduleId/status', medicineScheduleController.updateMedicineStatus);

// DELETE - Delete medicine schedule
router.delete('/:scheduleId', medicineScheduleController.deleteMedicineSchedule);

module.exports = router;
