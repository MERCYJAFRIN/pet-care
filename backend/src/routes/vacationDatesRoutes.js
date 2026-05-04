const express = require('express');
const router = express.Router();
const vacationDatesController = require('../controllers/vacationDatesController');
const authMiddleware = require('../middleware/authMiddleware');

// All vacation dates routes are protected
router.use(authMiddleware);

// POST - Create vacation dates
router.post('/', vacationDatesController.createVacationDates);

// GET - Get all vacation dates for user
router.get('/', vacationDatesController.getVacationDatesByUserId);

// GET - Get upcoming vacations
router.get('/upcoming', vacationDatesController.getUpcomingVacations);

// GET - Get ongoing vacation
router.get('/ongoing', vacationDatesController.getOngoingVacation);

// GET - Get specific vacation date record
router.get('/:vacationId', vacationDatesController.getVacationDateById);

// PUT - Update vacation dates record
router.put('/:vacationId', vacationDatesController.updateVacationDates);

// DELETE - Delete vacation dates record
router.delete('/:vacationId', vacationDatesController.deleteVacationDates);

// GET - Get vacation dates for a specific pet (sub-route)
router.get('/pet/:petId', vacationDatesController.getVacationDatesByPetId);

module.exports = router;
