const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/all', doctorController.getAllDoctors); // Browsing verified doctors
router.get('/:id', doctorController.getDoctorById); // Viewing doctor details for booking

// Protected routes (Doctor only)
router.get('/profile/me', authMiddleware, doctorController.getDoctorProfile);
router.put('/profile/update', authMiddleware, doctorController.updateDoctorProfile);

module.exports = router;
