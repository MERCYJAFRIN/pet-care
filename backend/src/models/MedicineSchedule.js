const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicineSchedule = sequelize.define('MedicineSchedule', {
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
  medicineName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  frequency: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    allowNull: false,
  },
  morningTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  afternoonTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nightTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  morningStatus: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'pending',
  },
  afternoonStatus: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'pending',
  },
  nightStatus: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'pending',
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sideEffects: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'active',
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
  tableName: 'medicine_schedules',
  timestamps: true,
});

module.exports = MedicineSchedule;
