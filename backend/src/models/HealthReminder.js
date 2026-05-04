const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HealthReminder = sequelize.define('HealthReminder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  petId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'pets',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  reminderType: {
    type: DataTypes.ENUM(
      'vaccination',
      'checkup',
      'appointment',
      'medicine',
      'weight_check',
      'dental',
      'custom'
    ),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reminderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  frequency: {
    type: DataTypes.ENUM(
      'once',
      'daily',
      'weekly',
      'monthly',
      'yearly'
    ),
    defaultValue: 'once',
  },
  nextReminderDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  notificationSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  notificationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'health_reminders',
  timestamps: true,
});

module.exports = HealthReminder;
