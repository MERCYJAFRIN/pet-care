const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vaccination = sequelize.define('Vaccination', {
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
  vaccineName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vaccinationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nextDueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  vetClinic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vetName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  batchNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sideEffects: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'completed',
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  tableName: 'vaccinations',
  timestamps: true,
});

module.exports = Vaccination;
