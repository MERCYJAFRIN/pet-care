import React, { useState, useEffect } from 'react';
import { vaccinationService, petService } from '../services/authService';
import '../styles/vaccinations.css';

const VaccinationManagement = () => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    vaccineName: '',
    vaccinationDate: '',
    nextDueDate: '',
    vetClinic: '',
    vetName: '',
    batchNumber: '',
    sideEffects: '',
    notes: '',
  });

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      fetchVaccinations(selectedPetId);
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

  const fetchVaccinations = async (petId) => {
    try {
      setLoading(true);
      const response = await vaccinationService.getVaccinations(petId);
      setVaccinations(response.data.vaccinations || []);
    } catch (err) {
      setError('Failed to fetch vaccinations');
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
      if (editingId) {
        await vaccinationService.updateVaccination(selectedPetId, editingId, formData);
        setEditingId(null);
      } else {
        await vaccinationService.createVaccination(selectedPetId, formData);
      }
      setFormData({
        vaccineName: '',
        vaccinationDate: '',
        nextDueDate: '',
        vetClinic: '',
        vetName: '',
        batchNumber: '',
        sideEffects: '',
        notes: '',
      });
      setShowForm(false);
      fetchVaccinations(selectedPetId);
    } catch (err) {
      setError('Failed to save vaccination');
    }
  };

  const handleDelete = async (vaccinationId) => {
    if (window.confirm('Are you sure you want to delete this vaccination record?')) {
      try {
        await vaccinationService.deleteVaccination(selectedPetId, vaccinationId);
        fetchVaccinations(selectedPetId);
      } catch (err) {
        setError('Failed to delete vaccination');
      }
    }
  };

  const handleEdit = (vaccination) => {
    setFormData({
      vaccineName: vaccination.vaccineName,
      vaccinationDate: vaccination.vaccinationDate.split('T')[0],
      nextDueDate: vaccination.nextDueDate ? vaccination.nextDueDate.split('T')[0] : '',
      vetClinic: vaccination.vetClinic || '',
      vetName: vaccination.vetName || '',
      batchNumber: vaccination.batchNumber || '',
      sideEffects: vaccination.sideEffects || '',
      notes: vaccination.notes || '',
    });
    setEditingId(vaccination.id);
    setShowForm(true);
  };

  return (
    <div className="vaccination-container">
      <h2>Vaccination Management</h2>

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

      <button
        className="btn-primary"
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({
            vaccineName: '',
            vaccinationDate: '',
            nextDueDate: '',
            vetClinic: '',
            vetName: '',
            batchNumber: '',
            sideEffects: '',
            notes: '',
          });
        }}
      >
        {showForm ? 'Cancel' : '+ Add Vaccination'}
      </button>

      {showForm && (
        <form className="vaccination-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vaccine Name *</label>
            <input
              type="text"
              name="vaccineName"
              value={formData.vaccineName}
              onChange={handleChange}
              required
              placeholder="e.g., Rabies, DHPP, FVRCP"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Vaccination Date *</label>
              <input
                type="date"
                name="vaccinationDate"
                value={formData.vaccinationDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Next Due Date</label>
              <input
                type="date"
                name="nextDueDate"
                value={formData.nextDueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Vet Clinic</label>
              <input
                type="text"
                name="vetClinic"
                value={formData.vetClinic}
                onChange={handleChange}
                placeholder="Clinic name"
              />
            </div>

            <div className="form-group">
              <label>Vet Name</label>
              <input
                type="text"
                name="vetName"
                value={formData.vetName}
                onChange={handleChange}
                placeholder="Veterinarian name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Batch Number</label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              placeholder="Vaccine batch number"
            />
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
            {editingId ? 'Update Vaccination' : 'Add Vaccination'}
          </button>
        </form>
      )}

      <div className="vaccinations-list">
        <h3>Vaccination Records</h3>
        {loading ? (
          <p>Loading...</p>
        ) : vaccinations.length === 0 ? (
          <p>No vaccination records found for this pet.</p>
        ) : (
          <div className="records-grid">
            {vaccinations.map(vaccination => (
              <div key={vaccination.id} className="vaccination-card">
                <div className="card-header">
                  <h4>{vaccination.vaccineName}</h4>
                  <span className={`status ${vaccination.status}`}>{vaccination.status}</span>
                </div>
                <div className="card-body">
                  <p><strong>Date:</strong> {new Date(vaccination.vaccinationDate).toLocaleDateString()}</p>
                  {vaccination.nextDueDate && (
                    <p><strong>Next Due:</strong> {new Date(vaccination.nextDueDate).toLocaleDateString()}</p>
                  )}
                  {vaccination.vetClinic && <p><strong>Clinic:</strong> {vaccination.vetClinic}</p>}
                  {vaccination.vetName && <p><strong>Vet:</strong> {vaccination.vetName}</p>}
                  {vaccination.batchNumber && <p><strong>Batch:</strong> {vaccination.batchNumber}</p>}
                  {vaccination.sideEffects && <p><strong>Side Effects:</strong> {vaccination.sideEffects}</p>}
                  {vaccination.notes && <p><strong>Notes:</strong> {vaccination.notes}</p>}
                </div>
                <div className="card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(vaccination)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(vaccination.id)}
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

export default VaccinationManagement;
