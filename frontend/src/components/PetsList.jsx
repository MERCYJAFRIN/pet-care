import React, { useState, useEffect } from 'react';
import { petService } from '../services/authService';
import '../styles/pets.css';

const PetsList = ({ onNavigate }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    weight: '',
    color: '',
    vaccinated: false,
    neutered: false,
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await petService.getPets();
      const petsData = response.data?.pets || response.data || [];
      setPets(Array.isArray(petsData) ? petsData : []);
    } catch (err) {
      setError('Failed to fetch pets. Please check your connection.');
    } finally {
      setLoading(false);
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
      await petService.createPet(formData);
      setShowForm(false);
      fetchPets();
      setFormData({ name: '', type: 'dog', breed: '', age: '', weight: '', color: '', vaccinated: false, neutered: false });
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to create pet record.';
      const details = err.response?.data?.details;
      setError(`${serverMsg}${details ? `: ${Array.isArray(details) ? details.join(', ') : details}` : ''}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this pet?')) {
      try {
        await petService.deletePet(id);
        fetchPets();
      } catch (err) {
        setError('Delete failed');
      }
    }
  };

  const getPetIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'dog': return '🐕';
      case 'cat': return '🐈';
      case 'bird': return '🦜';
      case 'rabbit': return '🐇';
      default: return '🐾';
    }
  };

  if (loading && pets.length === 0) return (
    <div className="view-loading-state">
      <div className="skeleton-pet-header"></div>
      <div className="pets-grid">
        {[1, 2, 3].map(i => <div key={i} className="skeleton-card pet-skeleton"></div>)}
      </div>
    </div>
  );

  return (
    <div className="pets-view animate-fade-in">
      <div className="view-header">
        <div className="header-text">
          <h1>My Pet Family</h1>
          <p className="subtitle">Manage and monitor health profiles for your companions.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`btn-primary add-toggle ${showForm ? 'active' : ''}`}>
          {showForm ? 'Cancel Registration' : '+ Register New Pet'}
        </button>
      </div>

      {error && <div className="error-toast animate-slide-in">{error}</div>}

      {showForm && (
        <div className="card form-card animate-scale-up">
          <div className="form-header">
            <h3>Complete Pet Profile</h3>
            <p>Fill in the details to create a health monitoring profile.</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Pet Name</label>
                <input type="text" name="name" placeholder="e.g. Buddy" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Animal Species</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Breed</label>
                <input type="text" name="breed" placeholder="e.g. Golden Retriever" value={formData.breed} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Age (Years)</label>
                <input type="number" name="age" placeholder="2" value={formData.age} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" step="0.1" name="weight" placeholder="5.2" value={formData.weight} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Coat Color</label>
                <input type="text" name="color" placeholder="e.g. Golden / White" value={formData.color} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="checkbox-row">
                <label className="custom-checkbox">
                  <input type="checkbox" name="vaccinated" checked={formData.vaccinated} onChange={handleChange} />
                  <span className="checkmark"></span>
                  <span className="label-text">Up to date on vaccinations</span>
                </label>
                <label className="custom-checkbox">
                  <input type="checkbox" name="neutered" checked={formData.neutered} onChange={handleChange} />
                  <span className="checkmark"></span>
                  <span className="label-text">Neutered / Spayed</span>
                </label>
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-primary auth-submit">Register Member</button>
            </div>
          </form>
        </div>
      )}

      <div className="pets-grid">
        {pets.length === 0 ? (
          <div className="empty-state-view">
            <div className="empty-icon">🐾</div>
            <p>Your pet family is small right now. Add your first companion to get started!</p>
            <button onClick={() => setShowForm(true)} className="btn-secondary-sm">Add Pet Now</button>
          </div>
        ) : (
          pets.map(pet => (
            <div key={pet.id} className="card pet-card">
              <div className="pet-card-header">
                <div className="pet-avatar-large">
                  <span className="icon-bg">{getPetIcon(pet.type)}</span>
                </div>
                <div className="pet-info-main">
                  <h3>{pet.name}</h3>
                  <p className="pet-breed">{pet.breed || 'Mixed Breed'}</p>
                </div>
                <button onClick={() => handleDelete(pet.id)} className="btn-delete-mini" title="Remove Profile">✕</button>
              </div>

              <div className="pet-stats-row">
                <div className="stat-pill">
                  <span className="pill-label">AGE</span>
                  <span className="pill-value">{pet.age || '—'}yr</span>
                </div>
                <div className="stat-pill">
                  <span className="pill-label">WEIGHT</span>
                  <span className="pill-value">{pet.weight || '—'}kg</span>
                </div>
                <div className="stat-pill">
                  <span className="pill-label">TYPE</span>
                  <span className="pill-value">{pet.type}</span>
                </div>
              </div>

              <div className="pet-status-badges">
                {pet.vaccinated ? 
                  <span className="status-pill-vax active">✓ Vaccinated</span> : 
                  <span className="status-pill-vax inactive">⚠ Vax Due</span>
                }
                {pet.neutered && <span className="status-pill-neutered">✓ Neutered</span>}
              </div>

              <div className="pet-card-footer">
                <button className="btn-full-width-secondary" onClick={() => onNavigate('history')}>Health Journal</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PetsList;
