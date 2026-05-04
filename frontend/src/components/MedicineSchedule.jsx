import React, { useState, useEffect } from 'react';
import { medicineScheduleService, petService } from '../services/authService';
import '../styles/medicine-schedule.css';

const MedicineSchedule = () => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [todaysMedicines, setTodaysMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    startDate: '',
    endDate: '',
    frequency: 'once_daily',
    morningTime: '',
    afternoonTime: '',
    nightTime: '',
    reason: '',
    sideEffects: '',
    notes: '',
  });

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      fetchMedicineSchedules(selectedPetId);
      fetchTodaysMedicines(selectedPetId);
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

  const fetchMedicineSchedules = async (petId) => {
    try {
      setLoading(true);
      const response = await medicineScheduleService.getMedicineSchedules(petId, 'active');
      setSchedules(response.data.schedules || []);
    } catch (err) {
      setError('Failed to fetch medicine schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodaysMedicines = async (petId) => {
    try {
      const response = await medicineScheduleService.getTodaysMedicines(petId);
      setTodaysMedicines(response.data.schedules || []);
    } catch (err) {
      console.error('Failed to fetch today\'s medicines');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await medicineScheduleService.updateMedicineSchedule(selectedPetId, editingId, formData);
        setEditingId(null);
      } else {
        await medicineScheduleService.createMedicineSchedule(selectedPetId, formData);
      }
      resetForm();
      fetchMedicineSchedules(selectedPetId);
      fetchTodaysMedicines(selectedPetId);
    } catch (err) {
      setError('Failed to save medicine schedule');
    }
  };

  const resetForm = () => {
    setFormData({
      medicineName: '',
      dosage: '',
      startDate: '',
      endDate: '',
      frequency: 'once_daily',
      morningTime: '',
      afternoonTime: '',
      nightTime: '',
      reason: '',
      sideEffects: '',
      notes: '',
    });
    setShowForm(false);
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this medicine schedule?')) {
      try {
        await medicineScheduleService.deleteMedicineSchedule(selectedPetId, scheduleId);
        fetchMedicineSchedules(selectedPetId);
      } catch (err) {
        setError('Failed to delete medicine schedule');
      }
    }
  };

  const handleEdit = (schedule) => {
    setFormData({
      medicineName: schedule.medicineName,
      dosage: schedule.dosage,
      startDate: schedule.startDate.split('T')[0],
      endDate: schedule.endDate ? schedule.endDate.split('T')[0] : '',
      frequency: schedule.frequency,
      morningTime: schedule.morningTime || '',
      afternoonTime: schedule.afternoonTime || '',
      nightTime: schedule.nightTime || '',
      reason: schedule.reason || '',
      sideEffects: schedule.sideEffects || '',
      notes: schedule.notes || '',
    });
    setEditingId(schedule.id);
    setShowForm(true);
  };

  const handleStatusUpdate = async (scheduleId, timeOfDay, status) => {
    try {
      const currentSchedule = schedules.find(s => s.id === scheduleId);
      await medicineScheduleService.updateMedicineStatus(selectedPetId, scheduleId, {
        timeOfDay,
        status
      });
      fetchMedicineSchedules(selectedPetId);
      fetchTodaysMedicines(selectedPetId);
    } catch (err) {
      setError('Failed to update medicine status');
    }
  };

  return (
    <div className="medicine-schedule-container">
      <h2>Medicine Schedule Management</h2>

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

      {todaysMedicines.length > 0 && (
        <div className="todays-medicines">
          <h3>Today's Medicines</h3>
          <div className="medicine-cards">
            {todaysMedicines.map(medicine => (
              <div key={medicine.id} className="today-medicine-card">
                <h4>{medicine.medicineName}</h4>
                <p><strong>Dosage:</strong> {medicine.dosage}</p>
                <div className="medicine-times">
                  {medicine.morningTime && (
                    <div className="time-slot">
                      <span>Morning: {medicine.morningTime}</span>
                      <span className="status">{medicine.morningStatus}</span>
                    </div>
                  )}
                  {medicine.afternoonTime && (
                    <div className="time-slot">
                      <span>Afternoon: {medicine.afternoonTime}</span>
                      <span className="status">{medicine.afternoonStatus}</span>
                    </div>
                  )}
                  {medicine.nightTime && (
                    <div className="time-slot">
                      <span>Night: {medicine.nightTime}</span>
                      <span className="status">{medicine.nightStatus}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          resetForm();
        }}
      >
        {showForm ? 'Cancel' : '+ Add Medicine Schedule'}
      </button>

      {showForm && (
        <form className="medicine-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Medicine Name *</label>
              <input
                type="text"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                required
                placeholder="e.g., Amoxicillin, Metformin"
              />
            </div>

            <div className="form-group">
              <label>Dosage *</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                required
                placeholder="e.g., 500mg, 1 tablet"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Frequency *</label>
              <select name="frequency" value={formData.frequency} onChange={handleChange} required>
                <option value="once_daily">Once Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="thrice_daily">Thrice Daily</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Reason</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Reason for medication"
            />
          </div>

          <div className="time-inputs">
            <h4>Medicine Times</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Morning Time</label>
                <input
                  type="time"
                  name="morningTime"
                  value={formData.morningTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Afternoon Time</label>
                <input
                  type="time"
                  name="afternoonTime"
                  value={formData.afternoonTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Night Time</label>
                <input
                  type="time"
                  name="nightTime"
                  value={formData.nightTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Side Effects</label>
            <textarea
              name="sideEffects"
              value={formData.sideEffects}
              onChange={handleChange}
              placeholder="Any observed side effects"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes"
              rows="2"
            />
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? 'Update Schedule' : 'Add Schedule'}
          </button>
        </form>
      )}

      <div className="medicine-schedules-list">
        <h3>Active Medicine Schedules</h3>
        {loading ? (
          <p>Loading...</p>
        ) : schedules.length === 0 ? (
          <p>No active medicine schedules found.</p>
        ) : (
          <div className="schedules-grid">
            {schedules.map(schedule => (
              <div key={schedule.id} className="schedule-card">
                <div className="card-header">
                  <h4>{schedule.medicineName}</h4>
                  <span className="status">{schedule.status}</span>
                </div>
                <div className="card-body">
                  <p><strong>Dosage:</strong> {schedule.dosage}</p>
                  <p><strong>Start:</strong> {new Date(schedule.startDate).toLocaleDateString()}</p>
                  {schedule.endDate && <p><strong>End:</strong> {new Date(schedule.endDate).toLocaleDateString()}</p>}
                  <p><strong>Frequency:</strong> {schedule.frequency.replace(/_/g, ' ')}</p>
                  {schedule.reason && <p><strong>Reason:</strong> {schedule.reason}</p>}
                  {schedule.sideEffects && <p><strong>Side Effects:</strong> {schedule.sideEffects}</p>}
                  {schedule.notes && <p><strong>Notes:</strong> {schedule.notes}</p>}
                </div>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => handleEdit(schedule)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(schedule.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSchedule;
