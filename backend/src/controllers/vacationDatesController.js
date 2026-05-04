const { VacationDates, Pet } = require('../models');

// Create a newvacation date record
exports.createVacationDates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { petId, startDate, endDate, title, description, location, pauseServices } = req.body;

    // Verify pet exists if provided and belongs to user
    if (petId) {
      const pet = await Pet.findByPk(petId);
      if (!pet || pet.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    const vacationDates = await VacationDates.create({
      userId,
      petId: petId || null,
      startDate,
      endDate,
      title,
      description,
      location,
      pauseServices: pauseServices !== undefined ? pauseServices : true,
      status: 'upcoming',
    });

    res.status(201).json({
      message: 'Vacation dates created successfully',
      vacationDates,
    });
  } catch (error) {
    console.error('Error creating vacation dates:', error);
    res.status(500).json({ message: 'Error creating vacation dates', error: error.message });
  }
};

// Get all vacation dates for a user
exports.getVacationDatesByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = { userId };
    if (status) {
      query.status = status;
    }

    const vacationDates = await VacationDates.findAll({
      where: query,
      order: [['startDate', 'DESC']],
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
          required: false,
        },
      ],
    });

    res.json({
      message: 'Vacation dates retrieved successfully',
      vacationDates,
      count: vacationDates.length,
    });
  } catch (error) {
    console.error('Error fetching vacation dates:', error);
    res.status(500).json({ message: 'Error fetching vacation dates', error: error.message });
  }
};

// Get vacation dates for a specific pet
exports.getVacationDatesByPetId = async (req, res) => {
  try {
    const { petId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const vacationDates = await VacationDates.findAll({
      where: { petId },
      order: [['startDate', 'DESC']],
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    res.json({
      message: 'Vacation dates retrieved successfully',
      vacationDates,
      count: vacationDates.length,
    });
  } catch (error) {
    console.error('Error fetching vacation dates:', error);
    res.status(500).json({ message: 'Error fetching vacation dates', error: error.message });
  }
};

// Get a specific vacation date record
exports.getVacationDateById = async (req, res) => {
  try {
    const { vacationId } = req.params;

    const vacationDate = await VacationDates.findOne({
      where: { id: vacationId, userId: req.user.id },
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
          required: false,
        },
      ],
    });

    if (!vacationDate) {
      return res.status(404).json({ message: 'Vacation date not found' });
    }

    res.json({
      message: 'Vacation date retrieved successfully',
      vacationDate,
    });
  } catch (error) {
    console.error('Error fetching vacation date:', error);
    res.status(500).json({ message: 'Error fetching vacation date', error: error.message });
  }
};

// Update vacation dates record
exports.updateVacationDates = async (req, res) => {
  try {
    const { vacationId } = req.params;
    const { startDate, endDate, title, description, location, pauseServices, status, petId } = req.body;

    const vacationDate = await VacationDates.findOne({
      where: { id: vacationId, userId: req.user.id },
    });

    if (!vacationDate) {
      return res.status(404).json({ message: 'Vacation date not found' });
    }

    // Verify new pet if provided
    if (petId && petId !== vacationDate.petId) {
      const pet = await Pet.findByPk(petId);
      if (!pet || pet.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    // Update fields
    if (startDate) vacationDate.startDate = startDate;
    if (endDate) vacationDate.endDate = endDate;
    if (title) vacationDate.title = title;
    if (description !== undefined) vacationDate.description = description;
    if (location) vacationDate.location = location;
    if (pauseServices !== undefined) vacationDate.pauseServices = pauseServices;
    if (status) vacationDate.status = status;
    if (petId) vacationDate.petId = petId;

    await vacationDate.save();

    res.json({
      message: 'Vacation dates updated successfully',
      vacationDate,
    });
  } catch (error) {
    console.error('Error updating vacation dates:', error);
    res.status(500).json({ message: 'Error updating vacation dates', error: error.message });
  }
};

// Delete vacation dates record
exports.deleteVacationDates = async (req, res) => {
  try {
    const { vacationId } = req.params;

    const vacationDate = await VacationDates.findOne({
      where: { id: vacationId, userId: req.user.id },
    });

    if (!vacationDate) {
      return res.status(404).json({ message: 'Vacation date not found' });
    }

    await vacationDate.destroy();

    res.json({
      message: 'Vacation dates deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vacation dates:', error);
    res.status(500).json({ message: 'Error deleting vacation dates', error: error.message });
  }
};

// Get upcoming vacation dates
exports.getUpcomingVacations = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingVacations = await VacationDates.findAll({
      where: {
        userId,
        startDate: {
          [require('sequelize').Op.gte]: today,
        },
      },
      order: [['startDate', 'ASC']],
    });

    res.json({
      message: 'Upcoming vacations retrieved successfully',
      vacations: upcomingVacations,
      count: upcomingVacations.length,
    });
  } catch (error) {
    console.error('Error fetching upcoming vacations:', error);
    res.status(500).json({ message: 'Error fetching vacations', error: error.message });
  }
};

// Get ongoing vacation (between start and end dates)
exports.getOngoingVacation = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ongoingVacations = await VacationDates.findAll({
      where: {
        userId,
        startDate: {
          [require('sequelize').Op.lte]: today,
        },
        endDate: {
          [require('sequelize').Op.gte]: today,
        },
      },
      include: [
        {
          model: Pet,
          attributes: ['id', 'name'],
          required: false,
        },
      ],
    });

    res.json({
      message: 'Ongoing vacation retrieved successfully',
      vacations: ongoingVacations,
      count: ongoingVacations.length,
    });
  } catch (error) {
    console.error('Error fetching ongoing vacation:', error);
    res.status(500).json({ message: 'Error fetching vacation', error: error.message });
  }
};
