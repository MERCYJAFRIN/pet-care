const { DoctorProfile, User } = require('../models');

// Get current doctor's professional profile
exports.getDoctorProfile = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({
      where: { userId: req.userId },
      include: [{ model: User, attributes: ['firstName', 'lastName', 'email', 'phone', 'profilePicture', 'isVerified'] }]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Doctor profile not found. Please complete your registration.' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor profile', error: error.message });
  }
};

// Create or update doctor professional details
exports.updateDoctorProfile = async (req, res) => {
  try {
    if (req.userRole !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Only doctors can update professional profiles.' });
    }

    const {
      specialization,
      experience,
      clinicName,
      clinicAddress,
      licenseNumber,
      bio,
      consultationFee,
      availableDays,
      availableTime,
      certificateUrl
    } = req.body;

    let profile = await DoctorProfile.findOne({ where: { userId: req.userId } });

    if (profile) {
      await profile.update({
        specialization,
        experience,
        clinicName,
        clinicAddress,
        licenseNumber,
        bio,
        consultationFee,
        availableDays,
        availableTime,
        certificateUrl
      });
    } else {
      profile = await DoctorProfile.create({
        userId: req.userId,
        specialization,
        experience,
        clinicName,
        clinicAddress,
        licenseNumber,
        bio,
        consultationFee,
        availableDays,
        availableTime,
        certificateUrl,
        isVerified: !!certificateUrl // Verify automatically if certificate is provided for now
      });
    }

    res.json({ message: 'Professional profile updated successfully', profile });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'This Medical License Number is already registered to another account.' });
    }
    res.status(500).json({ message: 'Error updating professional profile', error: error.message });
  }
};

// Get all doctors (for discovery)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.findAll({
      include: [{ model: User, attributes: ['firstName', 'lastName', 'profilePicture', 'email', 'phone', 'isVerified'] }]
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await DoctorProfile.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['firstName', 'lastName', 'profilePicture', 'email'] }]
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor details', error: error.message });
  }
};
