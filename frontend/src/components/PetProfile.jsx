import React, { useState, useEffect } from 'react';
import {
  petService,
  healthMetricsService,
  vaccinationService,
  medicalHistoryService,
  medicineScheduleService,
  healthReminderService,
} from '../services/authService';
import '../styles/pet-profile.css';

const PetProfile = ({ petId, onBack }) => {
  const [pet, setPet] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [editingHealthMetric, setEditingHealthMetric] = useState(null);
  const [showAddMetric, setShowAddMetric] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [petId]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [petRes, metricsRes, vaccRes, medRes, medsRes, remRes] = await Promise.all([
        petService.getPetById(petId),
        healthMetricsService.getHealthMetrics(petId),
        vaccinationService.getVaccinations(petId),
        medicalHistoryService.getMedicalHistory(petId),
        medicineScheduleService.getActiveMedicines(petId),
        healthReminderService.getHealthReminders(petId),
      ]);

      setPet(petRes.data.pet);
      setHealthMetrics(metricsRes.data?.metrics || []);
      setVaccinations(vaccRes.data?.vaccinations || []);
      setMedicalHistory(medRes.data?.medicalHistory || []);
      setMedicines(medsRes.data?.medicines || []);
      setReminders(remRes.data?.reminders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pet profile');
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatus = () => {
    if (healthMetrics.length === 0) return 'No data';
    const latest = healthMetrics[healthMetrics.length - 1];
    
    const status = [];
    if (latest.temperature && (latest.temperature < 37.5 || latest.temperature > 39)) status.push('⚠️ Fever');
    if (latest.heartRate && (latest.heartRate < 60 || latest.heartRate > 100)) status.push('⚠️ Heart Rate');
    if (latest.hydration === 'dehydrated') status.push('⚠️ Dehydration');
    
    return status.length > 0 ? status.join(' ') : '✅ Healthy';
  };

  const getVaccinationDue = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return vaccinations.filter(v => v.nextDueDate && new Date(v.nextDueDate) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)).length;
  };

  if (loading) return <div className="loading">Loading pet profile...</div>;
  if (!pet) return <div className="error">Pet not found</div>;

  return (
    <div className="pet-profile">
      <button onClick={onBack} className="btn-back">← Back</button>

      {/* Pet Header */}
      <div className="pet-header">
        <div className="pet-info">
          <h1>{pet.name}</h1>
          <div className="pet-basics">
            <span className="badge">{pet.type.toUpperCase()}</span>
            {pet.breed && <span className="breed">{pet.breed}</span>}
            {pet.age && <span className="age">{pet.age} years</span>}
            {pet.weight && <span className="weight">{pet.weight} kg</span>}
          </div>
        </div>
        <div className="health-status">
          <div className="status-card">
            <h3>Health Status</h3>
            <p className="status-value">{getHealthStatus()}</p>
          </div>
          <div className="status-card">
            <h3>Vaccinations Due</h3>
            <p className="status-value">{getVaccinationDue()} Due Soon</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          Health Metrics
        </button>
        <button 
          className={`tab ${activeTab === 'vaccinations' ? 'active' : ''}`}
          onClick={() => setActiveTab('vaccinations')}
        >
          Vaccinations
        </button>
        <button 
          className={`tab ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          Medical History
        </button>
        <button 
          className={`tab ${activeTab === 'medicines' ? 'active' : ''}`}
          onClick={() => setActiveTab('medicines')}
        >
          Medicines
        </button>
        <button 
          className={`tab ${activeTab === 'reminders' ? 'active' : ''}`}
          onClick={() => setActiveTab('reminders')}
        >
          Reminders
        </button>
      </div>

      {/* Tab Contents */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview">
            <div className="info-grid">
              <div className="info-card">
                <h3>Pet Information</h3>
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{pet.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Type:</span>
                  <span className="value">{pet.type}</span>
                </div>
                <div className="info-row">
                  <span className="label">Breed:</span>
                  <span className="value">{pet.breed || 'Not specified'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Age:</span>
                  <span className="value">{pet.age || 'Not specified'} years</span>
                </div>
                <div className="info-row">
                  <span className="label">Weight:</span>
                  <span className="value">{pet.weight || 'Not specified'} kg</span>
                </div>
                <div className="info-row">
                  <span className="label">Color:</span>
                  <span className="value">{pet.color || 'Not specified'}</span>
                </div>
              </div>

              <div className="info-card">
                <h3>Health Status</h3>
                <div className="info-row">
                  <span className="label">Vaccinated:</span>
                  <span className="value">{pet.vaccinated ? '✅ Yes' : '❌ No'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Neutered:</span>
                  <span className="value">{pet.neutered ? '✅ Yes' : '❌ No'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Latest Weight:</span>
                  <span className="value">
                    {healthMetrics.length > 0 ? `${healthMetrics[healthMetrics.length - 1].weight} kg` : 'No data'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Active Medicines:</span>
                  <span className="value">{medicines.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="health-metrics">
            <div className="section-header">
              <h2>Health Metrics</h2>
              <button className="btn-primary" onClick={() => setShowAddMetric(!showAddMetric)}>
                + Add Metric
              </button>
            </div>

            {healthMetrics.length === 0 ? (
              <p className="no-data">No health metrics recorded yet</p>
            ) : (
              <div className="metrics-list">
                {healthMetrics.map((metric, idx) => (
                  <div key={metric.id} className="metric-card">
                    <div className="metric-date">{new Date(metric.recordDate).toLocaleDateString()}</div>
                    <div className="metric-grid">
                      {metric.weight && <div className="metric-item"><span className="label">Weight:</span> {metric.weight} kg</div>}
                      {metric.temperature && <div className="metric-item"><span className="label">Temperature:</span> {metric.temperature}°C</div>}
                      {metric.heartRate && <div className="metric-item"><span className="label">Heart Rate:</span> {metric.heartRate} bpm</div>}
                      {metric.bloodPressure && <div className="metric-item"><span className="label">Blood Pressure:</span> {metric.bloodPressure}</div>}
                      {metric.hydration && <div className="metric-item"><span className="label">Hydration:</span> {metric.hydration}</div>}
                      {metric.appetite && <div className="metric-item"><span className="label">Appetite:</span> {metric.appetite}</div>}
                    </div>
                    {metric.notes && <div className="metric-notes">{metric.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vaccinations' && (
          <div className="vaccinations">
            <div className="section-header">
              <h2>Vaccination Records</h2>
            </div>

            {vaccinations.length === 0 ? (
              <p className="no-data">No vaccinations recorded</p>
            ) : (
              <div className="vaccinations-list">
                {vaccinations.map((vacc) => {
                  const nextDue = vacc.nextDueDate ? new Date(vacc.nextDueDate) : null;
                  const today = new Date();
                  const isOverdue = nextDue && nextDue < today;
                  
                  return (
                    <div key={vacc.id} className={`vaccination-card ${isOverdue ? 'overdue' : ''}`}>
                      <div className="vacc-header">
                        <h3>{vacc.vaccineName}</h3>
                        {isOverdue && <span className="badge-overdue">OVERDUE</span>}
                      </div>
                      <div className="vacc-info">
                        <div><span className="label">Given:</span> {new Date(vacc.vaccinationDate).toLocaleDateString()}</div>
                        <div><span className="label">Vet:</span> {vacc.veterinarian}</div>
                        {nextDue && <div><span className="label">Next Due:</span> {nextDue.toLocaleDateString()}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="medical-history">
            <div className="section-header">
              <h2>Medical History</h2>
            </div>

            {medicalHistory.length === 0 ? (
              <p className="no-data">No medical history recorded</p>
            ) : (
              <div className="timeline">
                {medicalHistory.map((record, idx) => (
                  <div key={record.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="date">{new Date(record.visitDate).toLocaleDateString()}</div>
                      <h4>{record.condition}</h4>
                      <p><strong>Veterinarian:</strong> {record.veterinarian}</p>
                      {record.diagnosis && <p><strong>Diagnosis:</strong> {record.diagnosis}</p>}
                      {record.treatment && <p><strong>Treatment:</strong> {record.treatment}</p>}
                      {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'medicines' && (
          <div className="medicines">
            <div className="section-header">
              <h2>Active Medicines</h2>
            </div>

            {medicines.length === 0 ? (
              <p className="no-data">No active medicines</p>
            ) : (
              <div className="medicines-list">
                {medicines.map((med) => (
                  <div key={med.id} className="medicine-card">
                    <h3>{med.medicineName}</h3>
                    <div className="med-info">
                      <div><span className="label">Dosage:</span> {med.dosage}</div>
                      <div><span className="label">Frequency:</span> {med.frequency}</div>
                      <div><span className="label">Start Date:</span> {new Date(med.startDate).toLocaleDateString()}</div>
                      {med.endDate && <div><span className="label">End Date:</span> {new Date(med.endDate).toLocaleDateString()}</div>}
                      {med.reason && <p><strong>Reason:</strong> {med.reason}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="reminders">
            <div className="section-header">
              <h2>Health Reminders</h2>
            </div>

            {reminders.length === 0 ? (
              <p className="no-data">No reminders set</p>
            ) : (
              <div className="reminders-list">
                {reminders.map((reminder) => {
                  const reminderDate = new Date(reminder.reminderDate);
                  const today = new Date();
                  const isUpcoming = reminderDate > today;
                  
                  return (
                    <div key={reminder.id} className={`reminder-card ${!isUpcoming ? 'completed' : ''}`}>
                      <div className="reminder-type">{reminder.reminderType}</div>
                      <h3>{reminder.title}</h3>
                      <p>{reminder.description}</p>
                      <div className="reminder-info">
                        <span className="date">📅 {reminderDate.toLocaleDateString()}</span>
                        <span className="frequency">🔄 {reminder.frequency}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PetProfile;
