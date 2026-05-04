import React, { useState, useEffect } from 'react';
import {
  petService,
  vaccinationService,
  weightLossService,
  medicalHistoryService,
  medicineScheduleService,
  healthReminderService,
} from '../services/authService';
import '../styles/health-dashboard.css';

const HealthDashboard = () => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      fetchDashboardData(selectedPetId);
    }
  }, [selectedPetId]);

  const fetchPets = async () => {
    try {
      const response = await petService.getPets();
      setPets(response.data.pets);
      if (response.data.pets.length > 0) {
        setSelectedPetId(response.data.pets[0].id);
      }
    } catch (err) {
      setError('Failed to fetch pets');
    }
  };

  const fetchDashboardData = async (petId) => {
    try {
      setLoading(true);
      
      const [
        petResponse,
        vaccinationsResponse,
        weightResponse,
        medicalResponse,
        medicinesResponse,
        remindersResponse,
        upcomingRemindersResponse,
        overdueRemindersResponse,
      ] = await Promise.all([
        petService.getPetById(petId),
        vaccinationService.getVaccinations(petId),
        weightLossService.getWeightRecords(petId),
        medicalHistoryService.getMedicalSummary(petId),
        medicineScheduleService.getActiveMedicines(petId),
        healthReminderService.getHealthReminders(petId),
        healthReminderService.getUpcomingReminders(petId),
        healthReminderService.getOverdueReminders(petId),
      ]);

      const data = {
        pet: petResponse.data.pet,
        vaccinations: vaccinationsResponse.data.vaccinations || [],
        weights: weightResponse.data.weightRecords || [],
        medicalSummary: medicalResponse.data.summary,
        activeMedicines: medicinesResponse.data.medicines || [],
        allReminders: remindersResponse.data.reminders || [],
        upcomingReminders: upcomingRemindersResponse.data.reminders || [],
        overdueReminders: overdueRemindersResponse.data.reminders || [],
      };

      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getVaccinationStatus = (vaccinations) => {
    if (!vaccinations || vaccinations.length === 0) return 'No vaccinations';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdue = vaccinations.filter(v => 
      v.nextDueDate && new Date(v.nextDueDate) < today
    ).length;
    
    const upcoming = vaccinations.filter(v => 
      v.nextDueDate && new Date(v.nextDueDate) >= today
    ).length;
    
    return { overdue, upcoming, total: vaccinations.length };
  };

  const getWeightStatus = (weights) => {
    if (!weights || weights.length < 2) return null;
    
    const first = weights[weights.length - 1];
    const last = weights[0];
    const diff = last.weight - first.weight;
    const percent = ((diff / first.weight) * 100).toFixed(1);
    
    return {
      current: last.weight,
      initial: first.weight,
      difference: diff,
      percentChange: percent,
      unit: last.unit,
    };
  };

  const renderVisualization = () => {
    if (!dashboardData || !dashboardData.weights || dashboardData.weights.length === 0) {
      return <p className="no-data">No weight data available for visualization</p>;
    }

    const maxWeight = Math.max(...dashboardData.weights.map(w => w.weight));
    const minWeight = Math.min(...dashboardData.weights.map(w => w.weight));
    const range = maxWeight - minWeight || 1;

    return (
      <div className="weight-chart">
        <h4>Weight Progress</h4>
        <div className="chart-container">
          {dashboardData.weights.slice(0, 10).reverse().map((record, index) => {
            const percentage = ((record.weight - minWeight) / range) * 100;
            return (
              <div key={record.id} className="chart-bar-wrapper">
                <div className="chart-bar-group">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${Math.max(percentage, 5)}%`,
                      backgroundColor: index === dashboardData.weights.length - 1 ? '#4CAF50' : '#667eea',
                    }}
                    title={`${record.weight}${record.unit}`}
                  />
                </div>
                <label className="chart-label">{new Date(record.recordDate).toLocaleDateString()}</label>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <h2>Pet Health Dashboard</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="pet-selector">
        <label htmlFor="pet-select">Select Pet:</label>
        <select
          id="pet-select"
          value={selectedPetId}
          onChange={(e) => setSelectedPetId(e.target.value)}
        >
          {pets.map(pet => (
            <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
          ))}
        </select>
      </div>

      {dashboardData && (
        <>
          <div className="pet-overview-card">
            <h3>{dashboardData.pet.name}</h3>
            <div className="overview-grid">
              <div className="overview-item">
                <label>Breed</label>
                <p>{dashboardData.pet.breed || 'Not specified'}</p>
              </div>
              <div className="overview-item">
                <label>Age</label>
                <p>{dashboardData.pet.age || 'Not specified'} years</p>
              </div>
              <div className="overview-item">
                <label>Weight</label>
                <p>{dashboardData.pet.weight || 'Not recorded'} kg</p>
              </div>
              <div className="overview-item">
                <label>Type</label>
                <p>{dashboardData.pet.type}</p>
              </div>
            </div>
          </div>

          <div className="alerts-summary">
            {dashboardData.overdueReminders.length > 0 && (
              <div className="alert-box overdue">
                <h4>Overdue Reminders</h4>
                <p className="count">{dashboardData.overdueReminders.length}</p>
              </div>
            )}
            {dashboardData.upcomingReminders.length > 0 && (
              <div className="alert-box upcoming">
                <h4>Upcoming (7 days)</h4>
                <p className="count">{dashboardData.upcomingReminders.length}</p>
              </div>
            )}
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Vaccination Status</h3>
              {(() => {
                const status = getVaccinationStatus(dashboardData.vaccinations);
                if (typeof status === 'string') {
                  return <p>{status}</p>;
                }
                return (
                  <div className="status-details">
                    <div className="status-item">
                      <label>Total Vaccinations</label>
                      <p className="status-value">{status.total}</p>
                    </div>
                    <div className="status-item">
                      <label>Upcoming Due</label>
                      <p className="status-value upcoming-badge">{status.upcoming}</p>
                    </div>
                    <div className="status-item">
                      <label>Overdue</label>
                      <p className="status-value overdue-badge">{status.overdue}</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="dashboard-card">
              <h3>Medical History</h3>
              {dashboardData.medicalSummary ? (
                <div className="status-details">
                  <div className="status-item">
                    <label>Total Visits</label>
                    <p className="status-value">{dashboardData.medicalSummary.totalVisits}</p>
                  </div>
                  <div className="status-item">
                    <label>Total Cost</label>
                    <p className="status-value">₹{dashboardData.medicalSummary.totalCost.toFixed(2)}</p>
                  </div>
                  <div className="status-item">
                    <label>Conditions</label>
                    <p className="status-value">{dashboardData.medicalSummary.conditions.length}</p>
                  </div>
                </div>
              ) : (
                <p>No medical records</p>
              )}
            </div>

            <div className="dashboard-card">
              <h3>Active Medicines</h3>
              {dashboardData.activeMedicines.length > 0 ? (
                <div className="medicine-list">
                  {dashboardData.activeMedicines.slice(0, 3).map(med => (
                    <div key={med.id} className="medicine-item">
                      <p><strong>{med.medicineName}</strong></p>
                      <p className="dosage">{med.dosage} - {med.frequency.replace(/_/g, ' ')}</p>
                    </div>
                  ))}
                  {dashboardData.activeMedicines.length > 3 && (
                    <p className="more-items">+ {dashboardData.activeMedicines.length - 3} more</p>
                  )}
                </div>
              ) : (
                <p>No active medicines</p>
              )}
            </div>

            <div className="dashboard-card">
              <h3>Health Reminders</h3>
              {dashboardData.allReminders.length > 0 ? (
                <div className="reminder-list">
                  <p className="reminder-stat">
                    <strong>Total:</strong> {dashboardData.allReminders.length}
                  </p>
                  <p className="reminder-stat">
                    <strong>Pending:</strong>{' '}
                    <span className="pending-count">
                      {dashboardData.allReminders.filter(r => !r.completed).length}
                    </span>
                  </p>
                  <p className="reminder-stat">
                    <strong>Completed:</strong>{' '}
                    <span className="completed-count">
                      {dashboardData.allReminders.filter(r => r.completed).length}
                    </span>
                  </p>
                </div>
              ) : (
                <p>No reminders set</p>
              )}
            </div>
          </div>

          <div className="visualization-card">
            {(() => {
              const weightStatus = getWeightStatus(dashboardData.weights);
              return (
                <>
                  <div className="weight-summary">
                    <h3>Weight Tracking</h3>
                    {weightStatus ? (
                      <div className="weight-stats">
                        <div className="weight-stat">
                          <label>Current Weight</label>
                          <p className="value">{weightStatus.current} {weightStatus.unit}</p>
                        </div>
                        <div className="weight-stat">
                          <label>Initial Weight</label>
                          <p className="value">{weightStatus.initial} {weightStatus.unit}</p>
                        </div>
                        <div className="weight-stat">
                          <label>Change</label>
                          <p className={`value ${weightStatus.difference > 0 ? 'increase' : 'decrease'}`}>
                            {weightStatus.difference > 0 ? '+' : ''}{weightStatus.difference} {weightStatus.unit} ({weightStatus.percentChange}%)
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p>Need at least 2 weight records for comparison</p>
                    )}
                  </div>
                  {renderVisualization()}
                </>
              );
            })()}
          </div>

          {dashboardData.medicalSummary && dashboardData.medicalSummary.lastVisit && (
            <div className="last-visit-card">
              <h3>Last Vet Visit</h3>
              <div className="visit-details">
                <p><strong>Date:</strong> {new Date(dashboardData.medicalSummary.lastVisit.visitDate).toLocaleDateString()}</p>
                <p><strong>Condition:</strong> {dashboardData.medicalSummary.lastVisit.condition}</p>
                {dashboardData.medicalSummary.lastVisit.vetClinic && (
                  <p><strong>Clinic:</strong> {dashboardData.medicalSummary.lastVisit.vetClinic}</p>
                )}
                {dashboardData.medicalSummary.lastVisit.diagnosis && (
                  <p><strong>Diagnosis:</strong> {dashboardData.medicalSummary.lastVisit.diagnosis}</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HealthDashboard;
