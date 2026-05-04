const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HealthMetrics = sequelize.define('HealthMetrics', {
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
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Temperature in Celsius',
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Weight in kg',
  },
  heartRate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Beats per minute',
  },
  bloodPressure: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Format: systolic/diastolic',
  },
  respiratoryRate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Breaths per minute',
  },
  hydration: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'normal',
  },
  appetite: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'normal',
  },
  activityLevel: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'normal',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  recordedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'health_metrics',
  timestamps: true,
});

module.exports = HealthMetrics;
