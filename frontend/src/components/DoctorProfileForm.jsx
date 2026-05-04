import React, { useState, useEffect, useRef } from 'react';
import { doctorService } from '../services/authService';
import '../styles/doctor-profile.css';

const DoctorProfileForm = ({ onComplete, initialData = null }) => {
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    clinicName: '',
    clinicAddress: '',
    licenseNumber: '',
    bio: '',
    consultationFee: '500',
    availableDays: 'Mon,Tue,Wed,Thu,Fri',
    availableTime: '09:00 AM - 05:00 PM',
    certificateUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [certFile, setCertFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertFile(file);
      simulateUpload(file);
    }
  };

  const simulateUpload = (file) => {
    setIsUploading(true);
    // Simulate secure cloud upload
    setTimeout(() => {
      setFormData(prev => ({ 
        ...prev, 
        certificateUrl: `https://storage.petcare.com/certs/${Date.now()}_${file.name}` 
      }));
      setIsUploading(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.certificateUrl) {
      setError('Please upload your professional certificate for verification.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await doctorService.updateDoctorProfile(formData);
      onComplete();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update professional profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-profile-form-container animate-fade-in">
      <h2>Professional Verification Profile</h2>
      <p className="subtitle">Please provide your medical credentials to start practicing on PetCare.</p>

      {error && <div className="error-message-gradient mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="professional-form">
        <div className="form-section">
          <div className="form-section-header">
            <h3>👨‍⚕️ Basic Information</h3>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Medical Specialization</label>
              <input
                type="text"
                name="specialization"
                placeholder="e.g. Surgeon, Dermatologist"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="number"
                name="experience"
                placeholder="5"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <h3>🏥 Clinic & Licensing</h3>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Clinic/Hospital Name</label>
              <input
                type="text"
                name="clinicName"
                placeholder="Happy Paws Clinic"
                value={formData.clinicName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Medical License Number</label>
              <input
                type="text"
                name="licenseNumber"
                placeholder="VET-XXXX-XXXX"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Professional Bio</label>
          <textarea
            name="bio"
            placeholder="Tell pet owners about your expertise and approach to animal care..."
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <h3>📜 Verification Document</h3>
          </div>
          <div 
            className={`certificate-upload-zone ${certFile ? 'active' : ''} ${isUploading ? 'analyzing' : ''}`}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
            />
            <div className="upload-icon-main">
              {isUploading ? '⏳' : certFile ? '📄' : '📤'}
            </div>
            <div className="upload-details">
              <h4>{isUploading ? 'Uploading Certificate...' : certFile ? 'Certificate Selected' : 'Upload Medical Certificate'}</h4>
              <p>{certFile ? certFile.name : 'Drag & drop or click to select (PDF, JPG, PNG)'}</p>
            </div>
            {formData.certificateUrl && !isUploading && (
              <div className="success-badge-upload">✓ Ready for Verification</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Consultation Fee (₹)</label>
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Available Time Slot</label>
            <input
              type="text"
              name="availableTime"
              placeholder="09:00 AM - 05:00 PM"
              value={formData.availableTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn-submit-premium" disabled={loading || isUploading}>
          {loading ? 'Submitting...' : 'Save & Submit Profile'}
        </button>
      </form>
    </div>
  );
};

export default DoctorProfileForm;
