const { MedicineSchedule, Pet } = require('../models');

// Create a new medicine schedule
exports.createMedicineSchedule = async (req, res) => {
  try {
    const { petId } = req.params;
    const { 
      medicineName, 
      dosage, 
      startDate, 
      endDate, 
      frequency, 
      morningTime, 
      afternoonTime, 
      nightTime, 
      reason, 
      sideEffects, 
      notes 
    } = req.body;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const medicineSchedule = await MedicineSchedule.create({
      petId,
      userId: req.user.id,
      medicineName,
      dosage,
      startDate,
      endDate,
      frequency,
      morningTime,
      afternoonTime,
      nightTime,
      reason,
      sideEffects,
      notes,
      status: 'active',
    });

    res.status(201).json({
      message: 'Medicine schedule created successfully',
      medicineSchedule,
    });
  } catch (error) {
    console.error('Error creating medicine schedule:', error);
    res.status(500).json({ message: 'Error creating medicine schedule', error: error.message });
  }
};

// Get all medicine schedules for a specific pet
exports.getMedicineSchedulesByPetId = async (req, res) => {
  try {
    const { petId } = req.params;
    const { status } = req.query;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let query = { petId };
    if (status) {
      query.status = status;
    }

    const schedules = await MedicineSchedule.findAll({
      where: query,
      order: [['startDate', 'DESC']],
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    res.json({
      message: 'Medicine schedules retrieved successfully',
      schedules,
      count: schedules.length,
    });
  } catch (error) {
    console.error('Error fetching medicine schedules:', error);
    res.status(500).json({ message: 'Error fetching schedules', error: error.message });
  }
};

// Get a specific medicine schedule
exports.getMedicineScheduleById = async (req, res) => {
  try {
    const { petId, scheduleId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const schedule = await MedicineSchedule.findOne({
      where: { id: scheduleId, petId },
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Medicine schedule not found' });
    }

    res.json({
      message: 'Medicine schedule retrieved successfully',
      schedule,
    });
  } catch (error) {
    console.error('Error fetching medicine schedule:', error);
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
};

// Update medicine schedule
exports.updateMedicineSchedule = async (req, res) => {
  try {
    const { petId, scheduleId } = req.params;
    const { 
      medicineName, 
      dosage, 
      startDate, 
      endDate, 
      frequency, 
      morningTime, 
      afternoonTime, 
      nightTime,
      morningStatus,
      afternoonStatus,
      nightStatus,
      reason, 
      sideEffects, 
      notes,
      status 
    } = req.body;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const schedule = await MedicineSchedule.findOne({
      where: { id: scheduleId, petId },
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Medicine schedule not found' });
    }

    // Update fields
    if (medicineName) schedule.medicineName = medicineName;
    if (dosage) schedule.dosage = dosage;
    if (startDate) schedule.startDate = startDate;
    if (endDate) schedule.endDate = endDate;
    if (frequency) schedule.frequency = frequency;
    if (morningTime) schedule.morningTime = morningTime;
    if (afternoonTime) schedule.afternoonTime = afternoonTime;
    if (nightTime) schedule.nightTime = nightTime;
    if (morningStatus) schedule.morningStatus = morningStatus;
    if (afternoonStatus) schedule.afternoonStatus = afternoonStatus;
    if (nightStatus) schedule.nightStatus = nightStatus;
    if (reason) schedule.reason = reason;
    if (sideEffects !== undefined) schedule.sideEffects = sideEffects;
    if (notes) schedule.notes = notes;
    if (status) schedule.status = status;

    await schedule.save();

    res.json({
      message: 'Medicine schedule updated successfully',
      schedule,
    });
  } catch (error) {
    console.error('Error updating medicine schedule:', error);
    res.status(500).json({ message: 'Error updating schedule', error: error.message });
  }
};

// Update medicine status (morning, afternoon, night)
exports.updateMedicineStatus = async (req, res) => {
  try {
    const { petId, scheduleId } = req.params;
    const { timeOfDay, status } = req.body; // timeOfDay: 'morning', 'afternoon', 'night'

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const schedule = await MedicineSchedule.findOne({
      where: { id: scheduleId, petId },
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Medicine schedule not found' });
    }

    // Update the appropriate status field
    const statusField = `${timeOfDay}Status`;
    if (schedule[statusField]) {
      schedule[statusField] = status;
      await schedule.save();
    } else {
      return res.status(400).json({ message: 'Invalid time of day' });
    }

    res.json({
      message: `Medicine ${status} for ${timeOfDay}`,
      schedule,
    });
  } catch (error) {
    console.error('Error updating medicine status:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// Delete medicine schedule
exports.deleteMedicineSchedule = async (req, res) => {
  try {
    const { petId, scheduleId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const schedule = await MedicineSchedule.findOne({
      where: { id: scheduleId, petId },
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Medicine schedule not found' });
    }

    await schedule.destroy();

    res.json({
      message: 'Medicine schedule deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting medicine schedule:', error);
    res.status(500).json({ message: 'Error deleting schedule', error: error.message });
  }
};

// Get today's medicine schedule
exports.getTodaysMedicines = async (req, res) => {
  try {
    const { petId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const schedules = await MedicineSchedule.findAll({
      where: {
        petId,
        status: 'active',
        startDate: {
          [require('sequelize').Op.lte]: today,
        },
        [require('sequelize').Op.or]: [
          { endDate: null },
          { endDate: { [require('sequelize').Op.gte]: today } },
        ],
      },
    });

    res.json({
      message: 'Today\'s medicines retrieved successfully',
      date: today.toISOString().split('T')[0],
      schedules,
      count: schedules.length,
    });
  } catch (error) {
    console.error('Error fetching today\'s medicines:', error);
    res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
};

// Get active medicines for a pet
exports.getActiveMedicines = async (req, res) => {
  try {
    const { petId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeMedicines = await MedicineSchedule.findAll({
      where: {
        petId,
        status: 'active',
        startDate: {
          [require('sequelize').Op.lte]: today,
        },
        [require('sequelize').Op.or]: [
          { endDate: null },
          { endDate: { [require('sequelize').Op.gte]: today } },
        ],
      },
      order: [['startDate', 'ASC']],
    });

    res.json({
      message: 'Active medicines retrieved successfully',
      medicines: activeMedicines,
      count: activeMedicines.length,
    });
  } catch (error) {
    console.error('Error fetching active medicines:', error);
    res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
};
