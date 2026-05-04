const { HealthMetrics, Pet } = require('../models');

// Create health metric record
exports.createHealthMetric = async (req, res) => {
  try {
    const { temperature, weight, heartRate, bloodPressure, respiratoryRate, hydration, appetite, activityLevel, notes } = req.body;
    const { petId } = req.params;

    // Verify pet exists and belongs to user
    const pet = await Pet.findOne({ where: { id: petId, userId: req.userId } });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const metric = await HealthMetrics.create({
      petId,
      userId: req.userId,
      temperature,
      weight,
      heartRate,
      bloodPressure,
      respiratoryRate,
      hydration,
      appetite,
      activityLevel,
      notes,
      recordedDate: new Date(),
    });

    res.status(201).json({
      message: 'Health metric recorded successfully',
      metric,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating health metric', error: error.message });
  }
};

// Get health metrics for a pet
exports.getHealthMetricsByPetId = async (req, res) => {
  try {
    const { petId } = req.params;

    const metrics = await HealthMetrics.findAll({
      where: { petId, userId: req.userId },
      order: [['recordedDate', 'DESC']],
    });

    res.json({ metrics });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching health metrics', error: error.message });
  }
};

// Get latest health metric
exports.getLatestHealthMetric = async (req, res) => {
  try {
    const { petId } = req.params;

    const metric = await HealthMetrics.findOne({
      where: { petId, userId: req.userId },
      order: [['recordedDate', 'DESC']],
    });

    if (!metric) {
      return res.status(404).json({ message: 'No health metrics found for this pet' });
    }

    res.json({ metric });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching health metric', error: error.message });
  }
};

// Get health metrics for date range (for analytics)
exports.getHealthMetricsDateRange = async (req, res) => {
  try {
    const { petId } = req.params;
    const { startDate, endDate } = req.query;

    const metrics = await HealthMetrics.findAll({
      where: {
        petId,
        userId: req.userId,
        recordedDate: {
          [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      order: [['recordedDate', 'ASC']],
    });

    res.json({ metrics });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching health metrics', error: error.message });
  }
};

// Update health metric
exports.updateHealthMetric = async (req, res) => {
  try {
    const { petId, metricId } = req.params;
    const { temperature, weight, heartRate, bloodPressure, respiratoryRate, hydration, appetite, activityLevel, notes } = req.body;

    const metric = await HealthMetrics.findOne({
      where: { id: metricId, petId, userId: req.userId },
    });

    if (!metric) {
      return res.status(404).json({ message: 'Health metric not found' });
    }

    await metric.update({
      temperature,
      weight,
      heartRate,
      bloodPressure,
      respiratoryRate,
      hydration,
      appetite,
      activityLevel,
      notes,
    });

    res.json({
      message: 'Health metric updated successfully',
      metric,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating health metric', error: error.message });
  }
};

// Delete health metric
exports.deleteHealthMetric = async (req, res) => {
  try {
    const { petId, metricId } = req.params;

    const metric = await HealthMetrics.findOne({
      where: { id: metricId, petId, userId: req.userId },
    });

    if (!metric) {
      return res.status(404).json({ message: 'Health metric not found' });
    }

    await metric.destroy();

    res.json({ message: 'Health metric deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting health metric', error: error.message });
  }
};
