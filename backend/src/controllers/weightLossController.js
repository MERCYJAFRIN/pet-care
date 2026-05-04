const { WeightLoss, Pet } = require('../models');

// Create a new weight loss record
exports.createWeightRecord = async (req, res) => {
  try {
    const { petId } = req.params;
    const { weight, unit, recordDate, notes } = req.body;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create weight record
    const weightRecord = await WeightLoss.create({
      petId,
      userId: req.user.id,
      weight,
      unit: unit || 'kg',
      recordDate,
      notes,
    });

    // Update pet's current weight
    if (weight) {
      pet.weight = weight;
      await pet.save();
    }

    res.status(201).json({
      message: 'Weight record created successfully',
      weightRecord,
    });
  } catch (error) {
    console.error('Error creating weight record:', error);
    res.status(500).json({ message: 'Error creating weight record', error: error.message });
  }
};

// Get all weight records for a specific pet
exports.getWeightRecordsByPetId = async (req, res) => {
  try {
    const { petId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let query = { petId };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.recordDate = {};
      if (startDate) {
        query.recordDate[require('sequelize').Op.gte] = new Date(startDate);
      }
      if (endDate) {
        query.recordDate[require('sequelize').Op.lte] = new Date(endDate);
      }
    }

    const weightRecords = await WeightLoss.findAll({
      where: query,
      order: [['recordDate', 'DESC']],
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    // Calculate weight loss/gain statistics
    let stats = null;
    if (weightRecords.length > 1) {
      const firstRecord = weightRecords[weightRecords.length - 1];
      const lastRecord = weightRecords[0];
      const weightDifference = lastRecord.weight - firstRecord.weight;
      const percentChange = ((weightDifference / firstRecord.weight) * 100).toFixed(2);

      stats = {
        initialWeight: firstRecord.weight,
        currentWeight: lastRecord.weight,
        weightDifference,
        percentChange,
        totalRecords: weightRecords.length,
        unit: lastRecord.unit,
      };
    }

    res.json({
      message: 'Weight records retrieved successfully',
      weightRecords,
      stats,
    });
  } catch (error) {
    console.error('Error fetching weight records:', error);
    res.status(500).json({ message: 'Error fetching weight records', error: error.message });
  }
};

// Get a specific weight record
exports.getWeightRecordById = async (req, res) => {
  try {
    const { petId, recordId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const weightRecord = await WeightLoss.findOne({
      where: { id: recordId, petId },
      include: [
        {
          model: Pet,
          attributes: ['id', 'name', 'type', 'breed'],
        },
      ],
    });

    if (!weightRecord) {
      return res.status(404).json({ message: 'Weight record not found' });
    }

    res.json({
      message: 'Weight record retrieved successfully',
      weightRecord,
    });
  } catch (error) {
    console.error('Error fetching weight record:', error);
    res.status(500).json({ message: 'Error fetching weight record', error: error.message });
  }
};

// Update weight record
exports.updateWeightRecord = async (req, res) => {
  try {
    const { petId, recordId } = req.params;
    const { weight, unit, recordDate, notes } = req.body;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const weightRecord = await WeightLoss.findOne({
      where: { id: recordId, petId },
    });

    if (!weightRecord) {
      return res.status(404).json({ message: 'Weight record not found' });
    }

    // Update fields
    if (weight !== undefined) weightRecord.weight = weight;
    if (unit) weightRecord.unit = unit;
    if (recordDate) weightRecord.recordDate = recordDate;
    if (notes) weightRecord.notes = notes;

    await weightRecord.save();

    res.json({
      message: 'Weight record updated successfully',
      weightRecord,
    });
  } catch (error) {
    console.error('Error updating weight record:', error);
    res.status(500).json({ message: 'Error updating weight record', error: error.message });
  }
};

// Delete weight record
exports.deleteWeightRecord = async (req, res) => {
  try {
    const { petId, recordId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const weightRecord = await WeightLoss.findOne({
      where: { id: recordId, petId },
    });

    if (!weightRecord) {
      return res.status(404).json({ message: 'Weight record not found' });
    }

    await weightRecord.destroy();

    res.json({
      message: 'Weight record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting weight record:', error);
    res.status(500).json({ message: 'Error deleting weight record', error: error.message });
  }
};

// Get weight loss statistics and trends
exports.getWeightTrends = async (req, res) => {
  try {
    const { petId } = req.params;
    const { period } = req.query; // 'week', 'month', 'year'

    // Verify pet exists and belongs to user
    const pet = await Pet.findByPk(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let startDate = new Date();
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const records = await WeightLoss.findAll({
      where: {
        petId,
        recordDate: {
          [require('sequelize').Op.gte]: startDate,
        },
      },
      order: [['recordDate', 'ASC']],
    });

    res.json({
      message: 'Weight trends retrieved successfully',
      period: period || 'month',
      records,
    });
  } catch (error) {
    console.error('Error fetching weight trends:', error);
    res.status(500).json({ message: 'Error fetching weight trends', error: error.message });
  }
};
