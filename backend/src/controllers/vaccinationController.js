const { Vaccination, Pet, User } = require('../models');

// Create a new vaccination record
exports.createVaccination = async (req, res) => {
  try {
    const { petId } = req.params;
    const { vaccineName, vaccinationDate, nextDueDate, vetClinic, vetName, batchNumber, sideEffects, notes } = req.body;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create vaccination record
    const vaccination = await Vaccination.create({
      petId,
      userId: req.user.id,
      vaccineName,
      vaccinationDate,
      nextDueDate,
      vetClinic,
      vetName,
      batchNumber,
      sideEffects,
      notes,
      status: 'completed',
    });

    res.status(201).json({
      message: 'Vaccination record created successfully',
      vaccination,
    });
  } catch (error) {
    console.error('Error creating vaccination:', error);
    res.status(500).json({ message: 'Error creating vaccination', error: error.message });
  }
};

// Get all vaccinations for a specific pet
exports.getVaccinationsByPetId = async (req, res) => {
  try {
    const { petId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const vaccinations = await Vaccination.findAll({
      where: { petId },
      order: [['vaccinationDate', 'DESC']],
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    res.json({
      message: 'Vaccinations retrieved successfully',
      vaccinations,
    });
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    res.status(500).json({ message: 'Error fetching vaccinations', error: error.message });
  }
};

// Get a specific vaccination record
exports.getVaccinationById = async (req, res) => {
  try {
    const { petId, vaccinationId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const vaccination = await Vaccination.findOne({
      where: { id: vaccinationId, petId },
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    if (!vaccination) {
      return res.status(404).json({ message: 'Vaccination not found' });
    }

    res.json({
      message: 'Vaccination retrieved successfully',
      vaccination,
    });
  } catch (error) {
    console.error('Error fetching vaccination:', error);
    res.status(500).json({ message: 'Error fetching vaccination', error: error.message });
  }
};

// Update vaccination record
exports.updateVaccination = async (req, res) => {
  try {
    const { petId, vaccinationId } = req.params;
    const { vaccineName, vaccinationDate, nextDueDate, vetClinic, vetName, batchNumber, sideEffects, status, notes } = req.body;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const vaccination = await Vaccination.findOne({
      where: { id: vaccinationId, petId },
    });

    if (!vaccination) {
      return res.status(404).json({ message: 'Vaccination not found' });
    }

    // Update fields
    if (vaccineName) vaccination.vaccineName = vaccineName;
    if (vaccinationDate) vaccination.vaccinationDate = vaccinationDate;
    if (nextDueDate) vaccination.nextDueDate = nextDueDate;
    if (vetClinic) vaccination.vetClinic = vetClinic;
    if (vetName) vaccination.vetName = vetName;
    if (batchNumber) vaccination.batchNumber = batchNumber;
    if (sideEffects !== undefined) vaccination.sideEffects = sideEffects;
    if (status) vaccination.status = status;
    if (notes) vaccination.notes = notes;

    await vaccination.save();

    res.json({
      message: 'Vaccination updated successfully',
      vaccination,
    });
  } catch (error) {
    console.error('Error updating vaccination:', error);
    res.status(500).json({ message: 'Error updating vaccination', error: error.message });
  }
};

// Delete vaccination record
exports.deleteVaccination = async (req, res) => {
  try {
    const { petId, vaccinationId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const vaccination = await Vaccination.findOne({
      where: { id: vaccinationId, petId },
    });

    if (!vaccination) {
      return res.status(404).json({ message: 'Vaccination not found' });
    }

    await vaccination.destroy();

    res.json({
      message: 'Vaccination deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vaccination:', error);
    res.status(500).json({ message: 'Error deleting vaccination', error: error.message });
  }
};

// Get vaccination reminders (overdue and upcoming)
exports.getVaccinationReminders = async (req, res) => {
  try {
    const { petId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const vaccinations = await Vaccination.findAll({
      where: { petId },
      order: [['nextDueDate', 'ASC']],
    });

    const overdue = vaccinations.filter((v) => v.nextDueDate && new Date(v.nextDueDate) < today);
    const upcoming = vaccinations.filter((v) => v.nextDueDate && new Date(v.nextDueDate) >= today);

    res.json({
      message: 'Vaccination reminders retrieved',
      overdue,
      upcoming,
    });
  } catch (error) {
    console.error('Error fetching vaccination reminders:', error);
    res.status(500).json({ message: 'Error fetching reminders', error: error.message });
  }
};
