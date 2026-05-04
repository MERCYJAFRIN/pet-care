const { HealthReminder, Pet } = require('../models');

// Create a new health reminder
exports.createHealthReminder = async (req, res) => {
  try {
    const { petId } = req.params;
    const { reminderType, title, description, reminderDate, frequency, notes } = req.body;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Calculate next reminder date based on frequency
    const nextReminderDate = calculateNextReminderDate(reminderDate, frequency);

    const healthReminder = await HealthReminder.create({
      petId,
      userId: req.user.id,
      reminderType,
      title,
      description,
      reminderDate,
      frequency,
      nextReminderDate,
      isActive: true,
      notes,
    });

    res.status(201).json({
      message: 'Health reminder created successfully',
      healthReminder,
    });
  } catch (error) {
    console.error('Error creating health reminder:', error);
    res.status(500).json({ message: 'Error creating reminder', error: error.message });
  }
};

// Get all health reminders for a specific pet
exports.getHealthRemindersByPetId = async (req, res) => {
  try {
    const { petId } = req.params;
    const { reminderType, isActive } = req.query;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let query = { petId };
    if (reminderType) {
      query.reminderType = reminderType;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const reminders = await HealthReminder.findAll({
      where: query,
      order: [['reminderDate', 'ASC']],
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    res.json({
      message: 'Health reminders retrieved successfully',
      reminders,
      count: reminders.length,
    });
  } catch (error) {
    console.error('Error fetching health reminders:', error);
    res.status(500).json({ message: 'Error fetching reminders', error: error.message });
  }
};

// Get a specific health reminder
exports.getHealthReminderById = async (req, res) => {
  try {
    const { petId, reminderId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const reminder = await HealthReminder.findOne({
      where: { id: reminderId, petId },
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Health reminder not found' });
    }

    res.json({
      message: 'Health reminder retrieved successfully',
      reminder,
    });
  } catch (error) {
    console.error('Error fetching health reminder:', error);
    res.status(500).json({ message: 'Error fetching reminder', error: error.message });
  }
};

// Update health reminder
exports.updateHealthReminder = async (req, res) => {
  try {
    const { petId, reminderId } = req.params;
    const { reminderType, title, description, reminderDate, frequency, isActive, notes } = req.body;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const reminder = await HealthReminder.findOne({
      where: { id: reminderId, petId },
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Health reminder not found' });
    }

    // Update fields
    if (reminderType) reminder.reminderType = reminderType;
    if (title) reminder.title = title;
    if (description !== undefined) reminder.description = description;
    if (reminderDate) {
      reminder.reminderDate = reminderDate;
      reminder.nextReminderDate = calculateNextReminderDate(reminderDate, frequency || reminder.frequency);
    }
    if (frequency) {
      reminder.frequency = frequency;
      reminder.nextReminderDate = calculateNextReminderDate(reminder.reminderDate, frequency);
    }
    if (isActive !== undefined) reminder.isActive = isActive;
    if (notes) reminder.notes = notes;

    await reminder.save();

    res.json({
      message: 'Health reminder updated successfully',
      reminder,
    });
  } catch (error) {
    console.error('Error updating health reminder:', error);
    res.status(500).json({ message: 'Error updating reminder', error: error.message });
  }
};

// Delete health reminder
exports.deleteHealthReminder = async (req, res) => {
  try {
    const { petId, reminderId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const reminder = await HealthReminder.findOne({
      where: { id: reminderId, petId },
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Health reminder not found' });
    }

    await reminder.destroy();

    res.json({
      message: 'Health reminder deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting health reminder:', error);
    res.status(500).json({ message: 'Error deleting reminder', error: error.message });
  }
};

// Mark reminder as completed
exports.markReminderCompleted = async (req, res) => {
  try {
    const { petId, reminderId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const reminder = await HealthReminder.findOne({
      where: { id: reminderId, petId },
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Health reminder not found' });
    }

    reminder.completed = true;
    reminder.completedDate = new Date();

    // If recurring, calculate next reminder
    if (reminder.frequency !== 'once') {
      reminder.nextreminderDate = calculateNextReminderDate(new Date(), reminder.frequency);
      reminder.completed = false;
    }

    await reminder.save();

    res.json({
      message: 'Reminder marked as completed',
      reminder,
    });
  } catch (error) {
    console.error('Error marking reminder complete:', error);
    res.status(500).json({ message: 'Error marking complete', error: error.message });
  }
};

// Get upcoming reminders (next 7 days)
exports.getUpcomingReminders = async (req, res) => {
  try {
    const { petId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingReminders = await HealthReminder.findAll({
      where: {
        petId,
        isActive: true,
        reminderDate: {
          [require('sequelize').Op.between]: [today, nextWeek],
        },
      },
      order: [['reminderDate', 'ASC']],
    });

    res.json({
      message: 'Upcoming reminders retrieved successfully',
      reminders: upcomingReminders,
      count: upcomingReminders.length,
    });
  } catch (error) {
    console.error('Error fetching upcoming reminders:', error);
    res.status(500).json({ message: 'Error fetching reminders', error: error.message });
  }
};

// Get overdue reminders
exports.getOverdueReminders = async (req, res) => {
  try {
    const { petId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueReminders = await HealthReminder.findAll({
      where: {
        petId,
        isActive: true,
        completed: false,
        reminderDate: {
          [require('sequelize').Op.lt]: today,
        },
      },
      order: [['reminderDate', 'ASC']],
    });

    res.json({
      message: 'Overdue reminders retrieved successfully',
      reminders: overdueReminders,
      count: overdueReminders.length,
    });
  } catch (error) {
    console.error('Error fetching overdue reminders:', error);
    res.status(500).json({ message: 'Error fetching reminders', error: error.message });
  }
};

// Helper function to calculate next reminder date
function calculateNextReminderDate(currentDate, frequency) {
  const nextDate = new Date(currentDate);

  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case 'once':
    default:
      return null;
  }

  return nextDate;
}
