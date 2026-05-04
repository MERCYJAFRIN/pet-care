import React, { useState, useEffect } from 'react';
import { vacationDatesService, petService } from '../services/authService';
import '../styles/vacation-dates.css';

const VacationDateManagement = () => {
  const [pets, setPets] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [ongoingVacations, setOngoingVacations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    petId: '',
    startDate: '',
    endDate: '',
    title: '',
    description: '',
    location: '',
    pauseServices: true,
  });

  useEffect(() => {
    fetchPets();
    fetchVacationDates();
    checkOngoingVacations();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await petService.getPets();
      setPets(response.data.pets);
    } catch (err) {
      setError('Failed to fetch pets');
    }
  };

  const fetchVacationDates = async () => {
    try {
      setLoading(true);
      const response = await vacationDatesService.getVacationDates();
      setVacations(response.data.vacationDates || []);
    } catch (err) {
      setError('Failed to fetch vacation dates');
    } finally {
      setLoading(false);
    }
  };

  const checkOngoingVacations = async () => {
    try {
      const response = await vacationDatesService.getOngoingVacation();
      setOngoingVacations(response.data.vacations || []);
    } catch (err) {
      console.error('Failed to fetch ongoing vacations');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await vacationDatesService.updateVacationDates(editingId, formData);
        setEditingId(null);
      } else {
        await vacationDatesService.createVacationDates(formData);
      }
      resetForm();
      fetchVacationDates();
      checkOngoingVacations();
    } catch (err) {
      setError('Failed to save vacation dates');
    }
  };

  const resetForm = () => {
    setFormData({
      petId: '',
      startDate: '',
      endDate: '',
      title: '',
      description: '',
      location: '',
      pauseServices: true,
    });
    setShowForm(false);
  };

  const handleDelete = async (vacationId) => {
    if (window.confirm('Are you sure you want to delete this vacation?')) {
      try {
        await vacationDatesService.deleteVacationDates(vacationId);
        fetchVacationDates();
        checkOngoingVacations();
      } catch (err) {
        setError('Failed to delete vacation dates');
      }
    }
  };

  const handleEdit = (vacation) => {
    setFormData({
      petId: vacation.petId || '',
      startDate: vacation.startDate.split('T')[0],
      endDate: vacation.endDate.split('T')[0],
      title: vacation.title,
      description: vacation.description || '',
      location: vacation.location || '',
      pauseServices: vacation.pauseServices,
    });
    setEditingId(vacation.id);
    setShowForm(true);
  };

  return (
    <div className="vacation-container">
      <h2>Vacation Date Management</h2>

      {error && <div className="error-message">{error}</div>}

      {ongoingVacations.length > 0 && (
        <div className="ongoing-alert">
          <h3>Ongoing Vacation(s)</h3>
          {ongoingVacations.map(vacation => (
            <div key={vacation.id} className="alert-card">
              <p><strong>{vacation.title}</strong></p>
              <p>
                {new Date(vacation.startDate).toLocaleDateString()} - {new Date(vacation.endDate).toLocaleDateString()}
              </p>
              {vacation.pauseServices && (
                <p className="pause-notice">Services paused during this period</p>
              )}
            </div>
          ))}
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
        {showForm ? 'Cancel' : '+ Add Vacation'}
      </button>

      {showForm && (
        <form className="vacation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Summer Vacation, Business Trip"
            />
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
              <label>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Pet (Optional)</label>
            <select name="petId" value={formData.petId} onChange={handleChange}>
              <option value="">All Pets</option>
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>{pet.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Vacation location"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Vacation details"
              rows="3"
            />
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="pauseServices"
              name="pauseServices"
              checked={formData.pauseServices}
              onChange={handleChange}
            />
            <label htmlFor="pauseServices">Pause services during vacation</label>
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? 'Update Vacation' : 'Add Vacation'}
          </button>
        </form>
      )}

      <div className="vacations-list">
        <h3>Vacation Schedule</h3>
        {loading ? (
          <p>Loading...</p>
        ) : vacations.length === 0 ? (
          <p>No vacation dates scheduled.</p>
        ) : (
          <div className="vacations-grid">
            {vacations.map(vacation => (
              <div key={vacation.id} className={`vacation-card ${vacation.status}`}>
                <div className="card-header">
                  <h4>{vacation.title}</h4>
                  <span className={`status ${vacation.status}`}>{vacation.status}</span>
                </div>
                <div className="card-body">
                  <p><strong>Duration:</strong> {new Date(vacation.startDate).toLocaleDateString()} - {new Date(vacation.endDate).toLocaleDateString()}</p>
                  {vacation.location && <p><strong>Location:</strong> {vacation.location}</p>}
                  {vacation.Pet && <p><strong>Pet:</strong> {vacation.Pet.name}</p>}
                  {vacation.description && <p><strong>Description:</strong> {vacation.description}</p>}
                  {vacation.pauseServices && (
                    <p className="pause-notice"><strong>Status:</strong> Services Paused</p>
                  )}
                </div>
                <div className="card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(vacation)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(vacation.id)}
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

export default VacationDateManagement;
