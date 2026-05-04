/**
 * Default Medical Records Seed Data
 * This file provides default medical history records for pets
 */

const defaultMedicalRecords = [
  {
    visitDate: new Date(new Date().setDate(new Date().getDate() - 30)), // 30 days ago
    vetClinic: 'City Pet Hospital',
    vetName: 'Dr. Sharma',
    condition: 'Health Checkup',
    diagnosis: 'Excellent overall health',
    treatment: 'Regular vaccination and health assessment',
    prescription: 'Continue regular diet and exercise. No medications needed.',
    medications: ['None'],
    notes: 'Pet is in excellent health. No abnormalities detected.',
    cost: 500,
  },
  {
    visitDate: new Date(new Date().setDate(new Date().getDate() - 60)), // 60 days ago
    vetClinic: 'Animal Care Center',
    vetName: 'Dr. Patel',
    condition: 'Vaccination',
    diagnosis: 'Due for annual vaccinations',
    treatment: 'Administered rabies and DHPP vaccines',
    prescription: 'Follow-up booster shot in 1 year',
    medications: ['Rabies Vaccine', 'DHPP Vaccine'],
    notes: 'Vaccination completed successfully. No adverse reactions.',
    cost: 700,
  },
  {
    visitDate: new Date(new Date().setDate(new Date().getDate() - 90)), // 90 days ago
    vetClinic: 'City Pet Hospital',
    vetName: 'Dr. Sharma',
    condition: 'Dental Cleaning',
    diagnosis: 'Tartar buildup on teeth',
    treatment: 'Professional dental cleaning and scaling',
    prescription: 'Brush teeth regularly. Use dental treats for maintenance.',
    medications: ['Antibiotic ointment for gums'],
    notes: 'Dental cleaning completed. Teeth are now clean. Recommend regular brushing.',
    cost: 1200,
  },
  {
    visitDate: new Date(new Date().setDate(new Date().getDate() - 120)), // 120 days ago
    vetClinic: 'Animal Care Center',
    vetName: 'Dr. Patel',
    condition: 'Skin Allergy',
    diagnosis: 'Mild allergic reaction to food',
    treatment: 'Prescribed antihistamine and special diet',
    prescription: 'Special hypoallergenic food. Antihistamine tablet once daily for 2 weeks.',
    medications: ['Cetirizine 5mg - 1 tablet daily'],
    notes: 'Symptoms improved significantly. Continue with special diet.',
    cost: 800,
  },
  {
    visitDate: new Date(new Date().setDate(new Date().getDate() - 150)), // 150 days ago
    vetClinic: 'City Pet Hospital',
    vetName: 'Dr. Sharma',
    condition: 'Ear Infection Treatment',
    diagnosis: 'Bacterial ear infection in both ears',
    treatment: 'Ear cleaning and antibiotic treatment',
    prescription: 'Antibiotic ear drops twice daily for 10 days. Follow-up in 1 week.',
    medications: ['Antibiotic ear drops (Otoflush)'],
    notes: 'Infection cleared after treatment. Monitor for recurrence.',
    cost: 600,
  },
  {
    visitDate: new Date(new Date().setDate(new Date().getDate() - 180)), // 180 days ago
    vetClinic: 'Animal Care Center',
    vetName: 'Dr. Patel',
    condition: 'Weight Management Consultation',
    diagnosis: 'Slight overweight condition',
    treatment: 'Dietary adjustment and exercise plan',
    prescription: 'Reduce daily calorie intake by 20%. Increase exercise to 45 minutes daily.',
    medications: ['None'],
    notes: 'Weight loss plan initiated. Follow-up in 3 months.',
    cost: 400,
  },
];

/**
 * Get all default medical records
 * @returns {Array} Array of default medical record objects
 */
const getAllDefaultRecords = () => defaultMedicalRecords;

/**
 * Get a specific number of default records
 * @param {number} count - Number of records to return
 * @returns {Array} Array of medical records
 */
const getDefaultRecords = (count = 3) => {
  return defaultMedicalRecords.slice(0, count);
};

/**
 * Get a random default medical record
 * @returns {Object} A random medical record object
 */
const getRandomRecord = () => {
  return defaultMedicalRecords[Math.floor(Math.random() * defaultMedicalRecords.length)];
};

/**
 * Create formatted medical history data with pet and user info
 * @param {string} petId - Pet ID
 * @param {string} userId - User ID
 * @param {number} count - Number of records
 * @returns {Array} Array of formatted medical history records
 */
const createMedicalHistoryData = (petId, userId, count = 3) => {
  return getDefaultRecords(count).map(record => ({
    ...record,
    petId,
    userId,
  }));
};

module.exports = {
  defaultMedicalRecords,
  getAllDefaultRecords,
  getDefaultRecords,
  getRandomRecord,
  createMedicalHistoryData,
};
