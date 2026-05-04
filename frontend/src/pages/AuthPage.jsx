import React, { useState } from 'react';
import { authService } from '../services/authService';
import '../styles/auth.css';

const AuthPage = ({ onSuccess, initialRole = 'user', onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: initialRole,
    certificateNumber: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authService.login(formData.email, formData.password);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onSuccess();
      } else {
        await authService.register(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName,
          formData.phone,
          formData.role,
          formData.certificateNumber
        );
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-container animate-fade-in ${formData.role === 'doctor' ? 'doctor-theme' : ''}`}>
      <div className="auth-visual">
        <img
          src={formData.role === 'doctor'
            ? "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1000" // Professional medical image
            : "https://images.unsplash.com/photo-1544568100-847a948585b9?w=1000"
          }
          alt="Premium Care"
          className="auth-image"
        />
        <div className="auth-overlay">
          <h1>{formData.role === 'doctor' ? 'Join Our Expert Network. 🩺' : 'Care. Cure. & Grooming. ✨'}</h1>
          <p>
            {formData.role === 'doctor'
              ? 'Connect with pet owners, manage your clinic, and provide world-class veterinary care.'
              : 'The premium destination for your pet\'s wellness. Log in to manage grooming, training, and healthcare records.'}
          </p>
        </div>
      </div>

      <div className="auth-form-wrapper">
        <div className="auth-header">
          <button className="btn-back-home" onClick={onBack}><span>←</span> Back to Home</button>
          <div className="logo">🐾 PetCare</div>
          <h2>{isLogin ? `${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Login` : 'Join the Family'}</h2>
          <p className="subtitle">
            {isLogin
              ? `Log in as a ${formData.role === 'doctor' ? 'Veterinarian' : 'Pet Owner'} to access your dashboard.`
              : 'Create a professional account to start your journey today.'}
          </p>
        </div>

        {error && <div className="error-toast animate-slide-in">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {(!isLogin || initialRole === 'user') && (
            <div className="role-selection-group">
              <label>I am a:</label>
              <div className="role-buttons">
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'user' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('user')}
                >
                  <span className="role-icon">👤</span>
                  <span className="role-label">Pet Owner</span>
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'doctor' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('doctor')}
                >
                  <span className="role-icon">🩺</span>
                  <span className="role-label">Veterinarian</span>
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && formData.role === 'doctor' && (
            <div className="form-group animate-slide-in">
              <label>Medical Certificate Number</label>
              <input
                type="text"
                name="certificateNumber"
                placeholder="VET-12345-XYZ"
                value={formData.certificateNumber}
                onChange={handleChange}
                required
              />
              <p className="field-hint">Required for professional verification</p>
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              className="auth-toggle"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
