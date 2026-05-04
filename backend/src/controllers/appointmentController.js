const { Appointment, Pet, User, DoctorProfile } = require('../models');

exports.createAppointment = async (req, res) => {
  try {
    const { petId, veterinarian, doctorPhone, doctorImage, doctorSpecialty, clinicName, serviceType, consultationMode, appointmentDate, description, fee, status, notes, meetLink } = req.body;

    const appointment = await Appointment.create({
      petId,
      userId: req.userId,
      doctorId: req.body.doctorId || null,
      veterinarian,
      doctorPhone: doctorPhone || '',
      doctorImage: doctorImage || '',
      doctorSpecialty: doctorSpecialty || '',
      clinicName: clinicName || '',
      serviceType: serviceType || 'vet_consultation',
      consultationMode: consultationMode || 'offline',
      appointmentDate,
      description,
      fee: fee || 500.00,
      status: status || 'scheduled',
      notes: notes || '',
      meetLink: meetLink || null,
      paymentStatus: 'pending',
    });

    // Fetch with Pet association
    const appointmentWithPet = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Pet,
          as: 'Pet',
          attributes: ['id', 'name', 'type', 'breed', 'age']
        }
      ],
    });

    const plainAppointment = appointmentWithPet.toJSON ? appointmentWithPet.toJSON() : appointmentWithPet;

    // Create notification for doctor
    if (appointment.doctorId) {
      const { Notification, DoctorProfile } = require('../models');
      const docProfile = await DoctorProfile.findByPk(appointment.doctorId);
      if (docProfile) {
        await Notification.create({
          userId: docProfile.userId,
          notificationType: 'appointment',
          title: 'New Patient Appointment',
          message: `Patient ${plainAppointment?.Pet?.name || 'Pet'} has booked an appointment with you.`,
          relatedId: appointment.id,
          priority: 'high'
        });
      }
    }


    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: plainAppointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    console.log('=== getAppointments START ===');
    console.log('User ID:', req.userId);

    const appointments = await Appointment.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Pet,
          as: 'Pet',
          attributes: ['id', 'name', 'type', 'breed', 'age']
        }
      ],
      order: [['appointmentDate', 'DESC']],
    });

    console.log('Appointments fetched:', appointments.length);
    console.log('First appointment:', appointments[0] ? JSON.stringify(appointments[0], null, 2) : 'No appointments');

    // Convert to plain objects to avoid serialization issues
    const plainAppointments = appointments.map(apt => apt.toJSON ? apt.toJSON() : apt);

    console.log('Response:', { appointments: plainAppointments });
    res.json({ appointments: plainAppointments });
  } catch (error) {
    console.error('ERROR in getAppointments:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      message: 'Error fetching appointments',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({
      where: { id: appointmentId, userId: req.userId },
      include: [
        {
          model: Pet,
          as: 'Pet',
          attributes: ['id', 'name', 'type', 'breed', 'age']
        }
      ],
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Convert to plain object to avoid serialization issues
    const plainAppointment = appointment.toJSON ? appointment.toJSON() : appointment;

    res.json({ appointment: plainAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment', error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { veterinarian, doctorPhone, doctorImage, doctorSpecialty, clinicName, serviceType, consultationMode, meetLink, appointmentDate, description, status, notes, petId } = req.body;

    const appointment = await Appointment.findOne({
      where: { id: appointmentId, userId: req.userId },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.update({
      petId: petId || appointment.petId,
      veterinarian,
      doctorPhone: doctorPhone || appointment.doctorPhone,
      doctorImage: doctorImage || appointment.doctorImage,
      doctorSpecialty: doctorSpecialty || appointment.doctorSpecialty,
      clinicName: clinicName || appointment.clinicName,
      serviceType: serviceType || appointment.serviceType,
      consultationMode: consultationMode || appointment.consultationMode,
      meetLink: meetLink || appointment.meetLink,
      appointmentDate,
      description,
      status,
      notes,
    });

    // Fetch updated appointment with Pet association
    const updatedAppointment = await Appointment.findByPk(appointmentId, {
      include: [
        {
          model: Pet,
          as: 'Pet',
          attributes: ['id', 'name', 'type', 'breed', 'age']
        }
      ],
    });

    // Convert to plain object to avoid serialization issues
    const plainAppointment = updatedAppointment.toJSON ? updatedAppointment.toJSON() : updatedAppointment;

    res.json({
      message: 'Appointment updated successfully',
      appointment: plainAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({
      where: { id: appointmentId, userId: req.userId },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.destroy();

    res.json({
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({
      where: { userId: req.userId }
    });

    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.findAll({
      where: { doctorId: doctorProfile.id },
      include: [
        {
          model: Pet,
          as: 'Pet',
          attributes: ['id', 'name', 'type', 'breed', 'age']
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ],
      order: [['appointmentDate', 'ASC']],
    });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor appointments', error: error.message });
  }
};

exports.updateAppointmentStatusByDoctor = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    const doctorProfile = await DoctorProfile.findOne({
      where: { userId: req.userId }
    });

    if (!doctorProfile) {
      return res.status(403).json({ message: 'Access denied. Doctor profile not found.' });
    }

    const appointment = await Appointment.findOne({
      where: { id: appointmentId, doctorId: doctorProfile.id },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or not assigned to you' });
    }

    await appointment.update({ status, notes: notes || appointment.notes });

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};

exports.updateMeetLinkByDoctor = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { meetLink } = req.body;

    const doctorProfile = await DoctorProfile.findOne({
      where: { userId: req.userId }
    });

    if (!doctorProfile) {
      return res.status(403).json({ message: 'Access denied. Doctor profile not found.' });
    }

    const appointment = await Appointment.findOne({
      where: { id: appointmentId, doctorId: doctorProfile.id },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or not assigned to you' });
    }

    await appointment.update({ meetLink });

    res.json({
      message: 'Meeting link updated successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating meeting link', error: error.message });
  }
};
