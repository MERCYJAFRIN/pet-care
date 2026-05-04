import React, { useState, useEffect } from 'react';
import { weightLossService, petService } from '../services/authService';
import '../styles/weight-loss.css';

const WeightLossTracking = () => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [weightRecords, setWeightRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    unit: 'kg',
    recordDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      fetchWeightRecords(selectedPetId);
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

  const fetchWeightRecords = async (petId) => {
    try {
      setLoading(true);
      const response = await weightLossService.getWeightRecords(petId);
      setWeightRecords(response.data.weightRecords || []);
      setStats(response.data.stats);
    } catch (err) {
      setError('Failed to fetch weight records');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await weightLossService.createWeightRecord(selectedPetId, formData);
      setFormData({
        weight: '',
        unit: 'kg',
        recordDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setShowForm(false);
      fetchWeightRecords(selectedPetId);
    } catch (err) {
      setError('Failed to save weight record');
    }
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this weight record?')) {
      try {
        await weightLossService.deleteWeightRecord(selectedPetId, recordId);
        fetchWeightRecords(selectedPetId);
      } catch (err) {
        setError('Failed to delete weight record');
      }
    }
  };

  return (
    <div className="weight-loss-container">
      <h2>Weight Loss Tracking</h2>

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

      {stats && (
        <div className="statistics-panel">
          <h3>Weight Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <label>Initial Weight</label>
              <p className="stat-value">{stats.initialWeight} {stats.unit}</p>
            </div>
            <div className="stat-card">
              <label>Current Weight</label>
              <p className="stat-value">{stats.currentWeight} {stats.unit}</p>
            </div>
            <div className="stat-card">
              <label>Weight Difference</label>
              <p className={`stat-value ${stats.weightDifference > 0 ? 'increase' : 'decrease'}`}>
                {stats.weightDifference > 0 ? '+' : ''}{stats.weightDifference} {stats.unit}
              </p>
            </div>
            <div className="stat-card">
              <label>Percentage Change</label>
              <p className={`stat-value ${stats.weightDifference > 0 ? 'increase' : 'decrease'}`}>
                {stats.percentChange}%
              </p>
            </div>
            <div className="stat-card">
              <label>Total Records</label>
              <p className="stat-value">{stats.totalRecords}</p>
            </div>
          </div>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ Add Weight Record'}
      </button>

      {showForm && (
        <form className="weight-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Weight *</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                placeholder="Enter weight"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Record Date *</label>
              <input
                type="date"
                name="recordDate"
                value={formData.recordDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any notes about this weight record"
              rows="2"
            />
          </div>

          <button type="submit" className="btn-primary">
            Add Weight Record
          </button>
        </form>
      )}

      <div className="weight-records-list">
        <h3>Weight Records ({weightRecords.length})</h3>
        {loading ? (
          <p>Loading...</p>
        ) : weightRecords.length === 0 ? (
          <p>No weight records found for this pet.</p>
        ) : (
          <div className="records-table">
            <div className="table-header">
              <div className="table-cell">Date</div>
              <div className="table-cell">Weight</div>
              <div className="table-cell">Notes</div>
              <div className="table-cell">Actions</div>
            </div>
            {weightRecords.map(record => (
              <div key={record.id} className="table-row">
                <div className="table-cell">{new Date(record.recordDate).toLocaleDateString()}</div>
                <div className="table-cell">{record.weight} {record.unit}</div>
                <div className="table-cell">{record.notes || '-'}</div>
                <div className="table-cell">
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(record.id)}
                  >
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

export default WeightLossTracking;
