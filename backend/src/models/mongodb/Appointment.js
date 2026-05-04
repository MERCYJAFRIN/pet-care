const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MongoPet', // Correctly refer to the Mongo model
    required: true
  },
  service: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model('MongoAppointment', appointmentSchema);
module.exports = Appointment;
