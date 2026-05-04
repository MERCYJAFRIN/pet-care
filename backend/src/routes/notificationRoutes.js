const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

// All notification routes are protected
router.use(authMiddleware);

// POST - Create notification
router.post('/', notificationController.createNotification);

// GET - Get all user notifications
router.get('/', notificationController.getUserNotifications);

// GET - Get unread notifications count
router.get('/unread', notificationController.getUnreadNotifications);

// GET - Get notification statistics
router.get('/stats', notificationController.getNotificationStats);

// GET - Get notifications for specific pet
router.get('/pet/:petId', notificationController.getPetNotifications);

// PUT - Mark notification as read
router.put('/:notificationId/read', notificationController.markAsRead);

// PUT - Mark all as read
router.put('/all/read', notificationController.markAllAsRead);

// PUT - Dismiss notification
router.put('/:notificationId/dismiss', notificationController.dismissNotification);

// DELETE - Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
