const sequelize = require('../config/database');
const User = require('./User');
const DoctorProfile = require('./DoctorProfile');
const Pet = require('./Pet');
const Appointment = require('./Appointment');
const MedicalHistory = require('./MedicalHistory');
const Vaccination = require('./Vaccination');
const WeightLoss = require('./WeightLoss');
const MedicineSchedule = require('./MedicineSchedule');
const VacationDates = require('./VacationDates');
const HealthReminder = require('./HealthReminder');
const HealthMetrics = require('./HealthMetrics');
const Notification = require('./Notification');
const Product = require('./Product')(sequelize);
const Order = require('./Order')(sequelize);

// Define associations
User.hasMany(Pet, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Pet.belongsTo(User, {
  foreignKey: 'userId',
});

// User-DoctorProfile One-to-One
User.hasOne(DoctorProfile, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

DoctorProfile.belongsTo(User, {
  foreignKey: 'userId',
});

// User-Appointment One-to-Many (Client side)
User.hasMany(Appointment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Appointment.belongsTo(User, {
  foreignKey: 'userId',
});

// DoctorProfile-Appointment One-to-Many
DoctorProfile.hasMany(Appointment, {
  foreignKey: 'doctorId',
  onDelete: 'CASCADE',
});

Appointment.belongsTo(DoctorProfile, {
  foreignKey: 'doctorId',
});

Pet.hasMany(Appointment, {
  foreignKey: 'petId',
  onDelete: 'CASCADE',
});

Appointment.belongsTo(Pet, {
  foreignKey: 'petId',
});

// Medical History associations
User.hasMany(MedicalHistory, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

MedicalHistory.belongsTo(User, {
  foreignKey: 'userId',
});

Pet.hasMany(MedicalHistory, {
  foreignKey: 'petId',
  onDelete: 'CASCADE',
});

MedicalHistory.belongsTo(Pet, {
  foreignKey: 'petId',
});

// Vaccination associations
User.hasMany(Vaccination, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Vaccination.belongsTo(User, {
  foreignKey: 'userId',
});

Pet.hasMany(Vaccination, {
  foreignKey: 'petId',
  onDelete: 'CASCADE',
});

Vaccination.belongsTo(Pet, {
  foreignKey: 'petId',
});

// Weight Loss associations
User.hasMany(WeightLoss, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

WeightLoss.belongsTo(User, {
  foreignKey: 'userId',
});

Pet.hasMany(WeightLoss, {
  foreignKey: 'petId',
  onDelete: 'CASCADE',
});

WeightLoss.belongsTo(Pet, {
  foreignKey: 'petId',
});

// Medicine Schedule associations
User.hasMany(MedicineSchedule, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

MedicineSchedule.belongsTo(User, {
  foreignKey: 'userId',
});

Pet.hasMany(MedicineSchedule, {
  foreignKey: 'petId',
  onDelete: 'CASCADE',
});

MedicineSchedule.belongsTo(Pet, {
  foreignKey: 'petId',
});

// Vacation Dates associations
User.hasMany(VacationDates, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

VacationDates.belongsTo(User, {
  foreignKey: 'userId',
});

Pet.hasMany(VacationDates, {
  foreignKey: 'petId',
  onDelete: 'CASCADE',
  allowNull: true,
});

VacationDates.belongsTo(Pet, {
  foreignKey: 'petId',
  allowNull: true,
});

// Health Reminder associations
User.hasMany(HealthReminder, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

HealthReminder.belongsTo(User, {
  foreignKey: 'userId',
});

Pet.hasMany(HealthReminder, {
  foreignKey: 'petId',
  onDelete: 'CASCADE',
});

HealthReminder.belongsTo(Pet, {
  foreignKey: 'petId',
});

// Health Metrics associations
User.hasMany(HealthMetrics, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

HealthMetrics.belongsTo(User, {
  foreignKey: 'userId',
});

Pet.hasMany(HealthMetrics, {
  foreignKey: 'petId',
  onDelete: 'CASCADE',
});

HealthMetrics.belongsTo(Pet, {
  foreignKey: 'petId',
});

// Notification associations
User.hasMany(Notification, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Notification.belongsTo(User, {
  foreignKey: 'userId',
});

Notification.belongsTo(Pet, {
  foreignKey: 'petId',
  allowNull: true,
});

// Marketplace associations
User.hasMany(Order, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Order.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = {
  sequelize,
  User,
  DoctorProfile,
  Pet,
  Appointment,
  MedicalHistory,
  Vaccination,
  WeightLoss,
  MedicineSchedule,
  VacationDates,
  HealthReminder,
  HealthMetrics,
  Notification,
  Product,
  Order,
};
