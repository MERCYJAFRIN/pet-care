const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// All appointment routes are protected
router.use(authMiddleware);

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/:appointmentId', appointmentController.getAppointmentById);
router.put('/:appointmentId', appointmentController.updateAppointment);
router.delete('/:appointmentId', appointmentController.deleteAppointment);

// Doctor specific actions
router.get('/doctor/all', appointmentController.getDoctorAppointments);
router.put('/doctor/:appointmentId/status', appointmentController.updateAppointmentStatusByDoctor);
router.put('/doctor/:appointmentId/meet-link', appointmentController.updateMeetLinkByDoctor);

module.exports = router;
