const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  petId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  veterinarian: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  doctorPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  doctorImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  doctorSpecialty: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clinicName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serviceType: {
    type: DataTypes.STRING,
    defaultValue: 'vet_consultation',
  },
  consultationMode: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'offline',
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 500.00,
  },
  status: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'scheduled',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  meetLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.STRING, // ENUM replaced with STRING for SQLite
    defaultValue: 'pending',
  },
});

module.exports = Appointment;
