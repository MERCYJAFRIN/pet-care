const { MedicalHistory, Pet } = require('../models');

// Create a new medical history record
exports.createMedicalHistory = async (req, res) => {
  try {
    const { petId } = req.params;
    const { visitDate, vetClinic, vetName, condition, diagnosis, treatment, prescription, notes, cost, attachments } = req.body;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const medicalHistory = await MedicalHistory.create({
      petId,
      userId: req.user.id,
      visitDate,
      vetClinic,
      vetName,
      condition,
      diagnosis,
      treatment,
      prescription,
      notes,
      cost,
      attachments: attachments || [],
    });

    res.status(201).json({
      message: 'Medical history record created successfully',
      medicalHistory,
    });
  } catch (error) {
    console.error('Error creating medical history:', error);
    res.status(500).json({ message: 'Error creating medical history', error: error.message });
  }
};

// Get all medical history for a specific pet
exports.getMedicalHistoryByPetId = async (req, res) => {
  try {
    const { petId } = req.params;

    // Verify pet exists and authorized access (owner or assigned doctor)
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    let isAuthorized = pet.userId === req.userId;

    if (!isAuthorized && req.userRole === 'doctor') {
      const { Appointment, DoctorProfile } = require('../models');
      const doctorProfile = await DoctorProfile.findOne({ where: { userId: req.userId } });
      if (doctorProfile) {
        const appointment = await Appointment.findOne({
          where: { petId, doctorId: doctorProfile.id }
        });
        if (appointment) isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Unauthorized access to pet medical records' });
    }

    const medicalHistory = await MedicalHistory.findAll({
      where: { petId },
      order: [['visitDate', 'DESC']],
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    res.json({
      message: 'Medical history retrieved successfully',
      records: medicalHistory,
      count: medicalHistory.length,
    });
  } catch (error) {
    console.error('Error fetching medical history:', error);
    res.status(500).json({ message: 'Error fetching medical history', error: error.message });
  }
};

// Get a specific medical history record
exports.getMedicalHistoryById = async (req, res) => {
  try {
    const { petId, recordId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const medicalRecord = await MedicalHistory.findOne({
      where: { id: recordId, petId },
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json({
      message: 'Medical record retrieved successfully',
      medicalRecord,
    });
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ message: 'Error fetching medical record', error: error.message });
  }
};

// Update medical history record
exports.updateMedicalHistory = async (req, res) => {
  try {
    const { petId, recordId } = req.params;
    const { visitDate, vetClinic, vetName, condition, diagnosis, treatment, prescription, notes, cost, attachments } = req.body;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const medicalRecord = await MedicalHistory.findOne({
      where: { id: recordId, petId },
    });

    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Update fields
    if (visitDate) medicalRecord.visitDate = visitDate;
    if (vetClinic) medicalRecord.vetClinic = vetClinic;
    if (vetName) medicalRecord.vetName = vetName;
    if (condition) medicalRecord.condition = condition;
    if (diagnosis) medicalRecord.diagnosis = diagnosis;
    if (treatment) medicalRecord.treatment = treatment;
    if (prescription) medicalRecord.prescription = prescription;
    if (notes) medicalRecord.notes = notes;
    if (cost) medicalRecord.cost = cost;
    if (attachments) medicalRecord.attachments = attachments;

    await medicalRecord.save();

    res.json({
      message: 'Medical record updated successfully',
      medicalRecord,
    });
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ message: 'Error updating medical record', error: error.message });
  }
};

// Delete medical history record
exports.deleteMedicalHistory = async (req, res) => {
  try {
    const { petId, recordId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const medicalRecord = await MedicalHistory.findOne({
      where: { id: recordId, petId },
    });

    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    await medicalRecord.destroy();

    res.json({
      message: 'Medical record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ message: 'Error deleting medical record', error: error.message });
  }
};

// Get medical history by condition
exports.getMedicalHistoryByCondition = async (req, res) => {
  try {
    const { petId, condition } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const records = await MedicalHistory.findAll({
      where: {
        petId,
        condition: {
          [require('sequelize').Op.iLike]: `%${condition}%`,
        },
      },
      order: [['visitDate', 'DESC']],
    });

    res.json({
      message: 'Medical records retrieved successfully',
      records,
      count: records.length,
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ message: 'Error fetching medical records', error: error.message });
  }
};

// Get medical summary for a pet
exports.getMedicalSummary = async (req, res) => {
  try {
    const { petId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const records = await MedicalHistory.findAll({
      where: { petId },
      order: [['visitDate', 'DESC']],
    });

    const totalCost = records.reduce((sum, record) => sum + (record.cost || 0), 0);
    const conditions = [...new Set(records.map(r => r.condition))];

    const summary = {
      totalVisits: records.length,
      totalCost,
      conditions,
      lastVisit: records.length > 0 ? records[0] : null,
      recentConditions: records.slice(0, 5),
    };

    res.json({
      message: 'Medical summary retrieved successfully',
      summary,
    });
  } catch (error) {
    console.error('Error fetching medical summary:', error);
    res.status(500).json({ message: 'Error fetching medical summary', error: error.message });
  }
};
