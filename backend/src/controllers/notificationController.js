const { Notification } = require('../models');
const { Op } = require('sequelize');

// Create notification
exports.createNotification = async (req, res) => {
  try {
    const { petId, notificationType, title, message, relatedId, priority, scheduledFor } = req.body;

    const notification = await Notification.create({
      userId: req.userId,
      petId,
      notificationType,
      title,
      message,
      relatedId,
      priority,
      scheduledFor: scheduledFor || new Date(),
      status: 'unread',
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

// Get all notifications for user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
    });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get unread notifications
exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.userId, status: 'unread' },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      unreadCount: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread notifications', error: error.message });
  }
};

// Get notifications for specific pet
exports.getPetNotifications = async (req, res) => {
  try {
    const { petId } = req.params;

    const notifications = await Notification.findAll({
      where: { userId: req.userId, petId },
      order: [['createdAt', 'DESC']],
    });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pet notifications', error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId: req.userId },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({
      status: 'read',
      readAt: new Date(),
    });

    res.json({
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { status: 'read', readAt: new Date() },
      { where: { userId: req.userId, status: 'unread' } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notifications as read', error: error.message });
  }
};

// Dismiss notification
exports.dismissNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId: req.userId },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ status: 'dismissed' });

    res.json({ message: 'Notification dismissed' });
  } catch (error) {
    res.status(500).json({ message: 'Error dismissing notification', error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId: req.userId },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};

// Get notification statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const unreadCount = await Notification.count({
      where: { userId: req.userId, status: 'unread' },
    });

    const byType = await Notification.findAll({
      where: { userId: req.userId },
      attributes: ['notificationType'],
      raw: true,
    });

    const typeCount = {};
    byType.forEach(n => {
      typeCount[n.notificationType] = (typeCount[n.notificationType] || 0) + 1;
    });

    const byPriority = await Notification.findAll({
      where: { userId: req.userId },
      attributes: ['priority'],
      raw: true,
    });

    const priorityCount = {};
    byPriority.forEach(n => {
      priorityCount[n.priority] = (priorityCount[n.priority] || 0) + 1;
    });

    res.json({
      unreadCount,
      byType: typeCount,
      byPriority: priorityCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification stats', error: error.message });
  }
};
