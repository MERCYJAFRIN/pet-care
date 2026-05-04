import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/authService';
import '../styles/dashboard.css';

const FindVet = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to fetch veterinarians. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    (doctor.User?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doctor.User?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doctor.specialization || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doctor.clinicName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overview-container animate-fade-in">
      <header className="overview-header">
        <div className="greeting-section">
          <h1>Find a Veterinarian</h1>
          <p>Professional care for your beloved pets.</p>
        </div>
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Search by name, specialization, or clinic..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="loading">Finding available doctors...</div>
      ) : error ? (
        <div className="error-toast">{error}</div>
      ) : filteredDoctors.length === 0 ? (
        <div className="empty-state-view card">
          <p>No veterinarians found matching your search.</p>
        </div>
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="card doctor-card animate-scale-up">
              <div className="doctor-card-header">
                <div className="doctor-avatar">
                  {doctor.User?.profilePicture ? (
                    <img src={doctor.User.profilePicture} alt={doctor.User?.firstName || 'Doctor'} />
                  ) : (
                    <div className="avatar-placeholder">Dr.</div>
                  )}
                </div>
                <div className="doctor-info">
                  <h3>Dr. {doctor.User?.firstName || ''} {doctor.User?.lastName || ''}</h3>
                  <p className="specialization">{doctor.specialization || 'General Vet'}</p>
                </div>
              </div>
              
              <div className="doctor-card-body">
                <div className="doctor-stat">
                  <span className="stat-label">Experience:</span>
                  <span className="stat-value">{doctor.experience} years</span>
                </div>
                <div className="doctor-stat">
                  <span className="stat-label">Clinic:</span>
                  <span className="stat-value">{doctor.clinicName || 'Private Practice'}</span>
                </div>
                <div className="doctor-stat">
                  <span className="stat-label">Fee:</span>
                  <span className="stat-value">₹{doctor.consultationFee}</span>
                </div>
              </div>

              <div className="doctor-card-footer">
                <button 
                  className="btn-primary w-full" 
                  onClick={() => onSelectDoctor(doctor)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindVet;
