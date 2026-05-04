import React, { useState, useEffect } from 'react';
import {
  petService,
  medicalHistoryService,
  vaccinationService,
  weightLossService,
  medicineScheduleService,
} from '../services/authService';
import '../styles/health-history.css';

const HealthHistory = () => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedTab, setSelectedTab] = useState('medical');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicalSummary, setMedicalSummary] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [weightRecords, setWeightRecords] = useState([]);
  const [medicineSchedules, setMedicineSchedules] = useState([]);

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      fetchAllHistory(selectedPetId);
    }
  }, [selectedPetId, selectedTab]);

  const fetchPets = async () => {
    try {
      const response = await petService.getPets();
      const petsData = response.data?.pets || response.data || [];
      setPets(Array.isArray(petsData) ? petsData : []);
      if (petsData.length > 0) setSelectedPetId(petsData[0].id);
    } catch (err) {
      setError('Failed to fetch pets family.');
    }
  };

  const fetchAllHistory = async (petId) => {
    setLoading(true);
    try {
      if (selectedTab === 'medical') {
        const [records, summary] = await Promise.all([
          medicalHistoryService.getMedicalHistory(petId),
          medicalHistoryService.getMedicalSummary(petId)
        ]);
        setMedicalRecords(records.data.records || []);
        setMedicalSummary(summary.data.summary || null);
      } else if (selectedTab === 'vaccination') {
        const res = await vaccinationService.getVaccinations(petId);
        setVaccinations(res.data.vaccinations || []);
      } else if (selectedTab === 'weight') {
        const res = await weightLossService.getWeightRecords(petId);
        setWeightRecords(res.data.records || []);
      } else if (selectedTab === 'medicine') {
        const res = await medicineScheduleService.getMedicineSchedules(petId);
        setMedicineSchedules(res.data.schedules || []);
      }
    } catch (err) {
      setError(`Failed to load ${selectedTab} records.`);
    } finally {
      setLoading(false);
    }
  };

  const renderMedical = () => (
    <div className="history-grid animate-fade-in">
      {medicalSummary && (
        <div className="card summary-card gold-border">
          <div className="summary-info">
            <div className="summary-item">
              <span className="label">Total Visits</span>
              <span className="value">{medicalSummary.totalVisits || 0}</span>
            </div>
            <div className="summary-item">
              <span className="label">Total Cost</span>
              <span className="value">₹{medicalSummary.totalCost || 0}</span>
            </div>
          </div>
        </div>
      )}
      {medicalRecords.map(r => (
        <div key={r.id} className="card history-card">
          <div className="card-header-flex">
            <h4>{r.condition}</h4>
            <span className="date-tag">{new Date(r.visitDate).toLocaleDateString()}</span>
          </div>
          <p className="clinic-text">📍 {r.vetClinic}</p>
          <div className="details-grid">
            <div className="detail"><strong>Diagnosis:</strong> {r.diagnosis}</div>
            <div className="detail"><strong>Treatment:</strong> {r.treatment}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderVaccinations = () => (
    <div className="history-grid animate-fade-in">
      {vaccinations.map(v => (
        <div key={v.id} className="card history-card">
          <div className="card-header-flex">
            <h4>{v.vaccineName}</h4>
            <span className="date-tag">{new Date(v.vaccinationDate).toLocaleDateString()}</span>
          </div>
          <div className="next-due">Next Due: {new Date(v.nextDueDate).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );

  const renderWeight = () => (
    <div className="history-grid animate-fade-in">
      {weightRecords.map(r => (
        <div key={r.id} className="card history-card">
          <div className="card-header-flex">
            <h4>Weight Entry</h4>
            <span className="date-tag">{new Date(r.recordDate).toLocaleDateString()}</span>
          </div>
          <div className="weight-display">
            <span className="weight-val">{r.weight}</span>
            <span className="weight-unit">{r.unit || 'kg'}</span>
          </div>
          {r.notes && <p className="notes-text">📝 {r.notes}</p>}
        </div>
      ))}
    </div>
  );

  const renderMedicine = () => (
    <div className="history-grid animate-fade-in">
      {medicineSchedules.map(m => (
        <div key={m.id} className="card history-card">
          <div className="card-header-flex">
            <h4>{m.medicineName}</h4>
            <span className={`status-pill ${m.status}`}>{m.status}</span>
          </div>
          <p className="dosage-text">💊 {m.dosage} • {m.frequency?.replace('_', ' ')}</p>
          <div className="date-range">
            <span>{new Date(m.startDate).toLocaleDateString()}</span>
            {m.endDate && <span> ➔ {new Date(m.endDate).toLocaleDateString()}</span>}
          </div>
        </div>
      ))}
    </div>
  );

  if (!selectedPetId) return (
    <div className="empty-state animate-fade-in">
      <div className="empty-icon">🐾</div>
      <h3>Start Your Health Journey</h3>
      <p>Add a pet to track their medical history, vaccinations, and more.</p>
    </div>
  );

  return (
    <div className="health-container animate-fade-in">
      {/* Sidebar - Health Overview & Alerts */}
      <aside className="health-sidebar">
        <div className="alert-card animate-slide-in">
          <div className="alert-header">
            <span className="icon-warning">⚠️</span> Vaccination Due
          </div>
          <div className="alert-body">
            <p>Important vaccinations may be overdue. Check the schedule below.</p>
            <a href="#appointments" className="alert-link">Schedule Appointment →</a>
          </div>
        </div>

        <div className="schedule-card animate-slide-in">
          <div className="schedule-header">
            <span className="icon-vaccine">💉</span> Vaccination Schedule
          </div>
          <div className="schedule-list">
            {vaccinations.length > 0 ? (
              vaccinations.slice(0, 3).map(v => (
                <div key={v.id} className="schedule-item">
                  <div className="vaccine-info">
                    <h4>{v.vaccineName}</h4>
                    <p>Due: {new Date(v.nextDueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-badge ${new Date(v.nextDueDate) < new Date() ? 'due' : 'done'}`}>
                    {new Date(v.nextDueDate) < new Date() ? '🕒 Due' : '✓ Current'}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-records-text">No upcoming vaccinations tracked.</p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content - Interactive Medical Timeline */}
      <main className="history-main">
        <div className="history-header">
          <h2 className="history-title">
            <span className="icon-main">🩺</span> Medical Records
          </h2>
          <div className="header-actions">
            <span className="download-link">Export PDF</span>
            <button className="btn-add-record" onClick={() => setShowForm(true)} title="Add Medical Record">+</button>
          </div>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setShowForm(false)}>
            <div className="card medical-form-card animate-scale-up">
              <div className="form-header">
                <h3>New Medical Entry</h3>
                <button className="btn-close-modal" onClick={() => setShowForm(false)}>✕</button>
              </div>

              <div className="medical-form-content">
                <div className="form-group">
                  <label>Condition / Title</label>
                  <input type="text" placeholder="e.g. Annual Checkup" className="med-input" />
                </div>
                <div className="form-group">
                  <label>Notes & Symptoms</label>
                  <textarea placeholder="Record symptoms, diagnosis, or treatment notes..." className="med-textarea"></textarea>
                </div>
                
                <div className="upload-zone">
                  <div className="upload-header">
                    <span className="upload-icon">📄</span>
                    <h4>Prescription & Reports</h4>
                    <p>Click or drag files to upload</p>
                  </div>
                  <p className="upload-note">PDF, JPG, PNG (Max 10MB)</p>
                </div>

                <div className="form-footer-btns">
                  <button className="btn-cancel-submit" onClick={() => setShowForm(false)}>Discard</button>
                  <button className="btn-add-submit" onClick={() => setShowForm(false)}>Save Record</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="timeline-wrapper">
          <div className="timeline-line"></div>
          
          {medicalRecords.length === 0 ? (
            <div className="no-records-main">
              <div className="no-records-icon">📋</div>
              <p>No medical history records found for this pet.</p>
              <button className="btn-secondary-sm" onClick={() => setShowForm(true)}>Add Your First Record</button>
            </div>
          ) : (
            medicalRecords.map((record, index) => (
              <div key={record.id} className="timeline-item animate-slide-in">
                <div className="timeline-node">
                  <span className="node-dot"></span>
                </div>
                <div className="timeline-card">
                  <div className="card-top">
                    <span className="clinic-name">{record.vetClinic || 'GENERAL CLINIC'}</span>
                    <span className="record-date">{new Date(record.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="card-body">
                    <h3>{record.condition}</h3>
                    <p className="diagnosis-text">{record.diagnosis}</p>
                    {record.treatment && (
                      <div className="treatment-tag">
                        <strong>RX:</strong> {record.treatment}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default HealthHistory;
