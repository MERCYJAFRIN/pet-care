const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  petId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'pets',
      key: 'id',
    },
  },
  notificationType: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  relatedId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID of related entity (vaccination, appointment, etc.)',
  },
  status: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'unread',
  },
  priority: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'medium',
  },
  scheduledFor: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When the notification should be sent',
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'notifications',
  timestamps: true,
});

module.exports = Notification;
