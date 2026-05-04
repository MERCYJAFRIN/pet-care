const express = require('express');
const router = express.Router({ mergeParams: true });
const healthReminderController = require('../controllers/healthReminderController');
const authMiddleware = require('../middleware/authMiddleware');

// All health reminder routes are protected
router.use(authMiddleware);

// POST - Create health reminder
router.post('/', healthReminderController.createHealthReminder);

// GET - Get all health reminders for a pet
router.get('/', healthReminderController.getHealthRemindersByPetId);

// GET - Get upcoming reminders (next 7 days)
router.get('/upcoming', healthReminderController.getUpcomingReminders);

// GET - Get overdue reminders
router.get('/overdue', healthReminderController.getOverdueReminders);

// GET - Get specific health reminder
router.get('/:reminderId', healthReminderController.getHealthReminderById);

// PUT - Update health reminder
router.put('/:reminderId', healthReminderController.updateHealthReminder);

// PUT - Mark reminder as completed
router.put('/:reminderId/complete', healthReminderController.markReminderCompleted);

// DELETE - Delete health reminder
router.delete('/:reminderId', healthReminderController.deleteHealthReminder);

module.exports = router;
