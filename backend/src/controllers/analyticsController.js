const { HealthMetrics, Vaccination, WeightLoss, MedicalHistory, Pet, Appointment } = require('../models');
const { Op } = require('sequelize');

// Get weight trend data for line chart
exports.getWeightTrendData = async (req, res) => {
  try {
    const { petId } = req.params;
    const { days = 90 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const weightData = await HealthMetrics.findAll({
      where: {
        petId,
        userId: req.userId,
        weight: { [Op.ne]: null },
        recordedDate: { [Op.gte]: startDate },
      },
      order: [['recordedDate', 'ASC']],
      attributes: ['recordedDate', 'weight'],
    });

    const chartData = weightData.map(record => ({
      date: record.recordedDate.toISOString().split('T')[0],
      weight: record.weight,
    }));

    res.json({
      petId,
      days,
      data: chartData,
      stats: {
        current: weightData.length > 0 ? weightData[weightData.length - 1].weight : null,
        min: weightData.length > 0 ? Math.min(...weightData.map(w => w.weight)) : null,
        max: weightData.length > 0 ? Math.max(...weightData.map(w => w.weight)) : null,
        average: weightData.length > 0 ? (weightData.reduce((sum, w) => sum + w.weight, 0) / weightData.length).toFixed(2) : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weight trend data', error: error.message });
  }
};

// Get vaccination status (radial chart)
exports.getVaccinationStatus = async (req, res) => {
  try {
    const { petId } = req.params;

    const vaccinationStatus = await Vaccination.findAll({
      where: { petId, userId: req.userId },
    });

    const statusCounts = {
      completed: 0,
      pending: 0,
      overdue: 0,
    };

    const today = new Date();
    vaccinationStatus.forEach(vaccine => {
      if (vaccine.status === 'completed') statusCounts.completed++;
      else if (vaccine.status === 'pending') statusCounts.pending++;
      else if (vaccine.status === 'overdue' || (vaccine.nextDueDate && vaccine.nextDueDate < today)) {
        statusCounts.overdue++;
      }
    });

    res.json({
      petId,
      vaccinationStatus: statusCounts,
      total: vaccinationStatus.length,
      vaccinations: vaccinationStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vaccination status', error: error.message });
  }
};

// Get temperature trend data
exports.getTemperatureTrendData = async (req, res) => {
  try {
    const { petId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const temperatureData = await HealthMetrics.findAll({
      where: {
        petId,
        userId: req.userId,
        temperature: { [Op.ne]: null },
        recordedDate: { [Op.gte]: startDate },
      },
      order: [['recordedDate', 'ASC']],
      attributes: ['recordedDate', 'temperature'],
    });

    const chartData = temperatureData.map(record => ({
      date: record.recordedDate.toISOString().split('T')[0],
      temperature: record.temperature,
    }));

    const normalRange = { min: 37.5, max: 39.2 }; // Normal dog temperature in Celsius

    res.json({
      petId,
      days,
      data: chartData,
      normalRange,
      stats: {
        current: temperatureData.length > 0 ? temperatureData[temperatureData.length - 1].temperature : null,
        average: temperatureData.length > 0 ? (temperatureData.reduce((sum, t) => sum + t.temperature, 0) / temperatureData.length).toFixed(2) : null,
        isNormal: temperatureData.length > 0 ? 
          (temperatureData[temperatureData.length - 1].temperature >= normalRange.min && 
           temperatureData[temperatureData.length - 1].temperature <= normalRange.max) : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching temperature trend data', error: error.message });
  }
};

// Get pet health dashboard summary
exports.getPetHealthDashboard = async (req, res) => {
  try {
    const { petId } = req.params;

    const pet = await Pet.findOne({ where: { id: petId, userId: req.userId } });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get latest metrics
    const latestMetrics = await HealthMetrics.findOne({
      where: { petId },
      order: [['recordedDate', 'DESC']],
    });

    // Get medical appointments
    const upcomingAppointments = await Appointment.findAll({
      where: {
        petId,
        appointmentDate: { [Op.gte]: today },
      },
      order: [['appointmentDate', 'ASC']],
      limit: 3,
    });

    // Get overdue vaccinations
    const overdueVaccinations = await Vaccination.findAll({
      where: {
        petId,
        [Op.or]: [
          { status: 'overdue' },
          { nextDueDate: { [Op.lt]: today } },
        ],
      },
    });

    // Get active medicines
    const activeMedicines = await HealthMetrics.findAll({
      where: { petId },
      order: [['recordedDate', 'DESC']],
      limit: 7,
    });

    // Get recent medical history
    const recentMedicalHistory = await MedicalHistory.findAll({
      where: {
        petId,
        visitDate: { [Op.gte]: thirtyDaysAgo },
      },
      order: [['visitDate', 'DESC']],
      limit: 5,
    });

    res.json({
      pet: {
        id: pet.id,
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        dateOfBirth: pet.dateOfBirth,
        profilePicture: pet.profilePicture,
      },
      latestMetrics: {
        temperature: latestMetrics?.temperature,
        weight: latestMetrics?.weight,
        heartRate: latestMetrics?.heartRate,
        appetite: latestMetrics?.appetite,
        activityLevel: latestMetrics?.activityLevel,
        recordedDate: latestMetrics?.recordedDate,
      },
      upcomingAppointments,
      overdueVaccinations,
      recentMedicalHistory,
      activityLast7Days: activeMedicines.length,
      alerts: {
        overdueVaccinations: overdueVaccinations.length,
        upcomingAppointments: upcomingAppointments.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching health dashboard', error: error.message });
  }
};

// Get medical condition analytics
exports.getMedicalConditionAnalytics = async (req, res) => {
  try {
    const { petId } = req.params;

    const medicalHistory = await MedicalHistory.findAll({
      where: { petId, userId: req.userId },
    });

    const conditionCounts = {};
    medicalHistory.forEach(record => {
      conditionCounts[record.condition] = (conditionCounts[record.condition] || 0) + 1;
    });

    const conditions = Object.entries(conditionCounts).map(([name, count]) => ({
      name,
      count,
    }));

    res.json({
      petId,
      totalRecords: medicalHistory.length,
      uniqueConditions: conditions.length,
      conditions,
      medicalHistory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medical analytics', error: error.message });
  }
};

// Get comprehensive pet analytics
exports.getComprehensiveAnalytics = async (req, res) => {
  try {
    const { petId } = req.params;

    const [weightData, temperatureData, vaccinationStatus, medicalConditions] = await Promise.all([
      HealthMetrics.findAll({ where: { petId, weight: { [Op.ne]: null } }, order: [['recordedDate', 'ASC']], limit: 30 }),
      HealthMetrics.findAll({ where: { petId, temperature: { [Op.ne]: null } }, order: [['recordedDate', 'ASC']], limit: 30 }),
      Vaccination.findAll({ where: { petId } }),
      MedicalHistory.findAll({ where: { petId } }),
    ]);

    res.json({
      petId,
      weightChart: {
        labels: weightData.map(d => d.recordedDate.toISOString().split('T')[0]),
        data: weightData.map(d => d.weight),
      },
      temperatureChart: {
        labels: temperatureData.map(d => d.recordedDate.toISOString().split('T')[0]),
        data: temperatureData.map(d => d.temperature),
      },
      vaccinationChart: {
        completed: vaccinationStatus.filter(v => v.status === 'completed').length,
        pending: vaccinationStatus.filter(v => v.status === 'pending').length,
        overdue: vaccinationStatus.filter(v => v.status === 'overdue').length,
        total: vaccinationStatus.length,
      },
      medicalConditions: medicalConditions.length,
      totalVisits: medicalConditions.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comprehensive analytics', error: error.message });
  }
};
