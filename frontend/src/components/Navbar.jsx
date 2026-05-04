import React from 'react';
import '../styles/dashboard.css';

const Navbar = ({ user, activeTab, setActiveTab, onLogout, isDoctor = false }) => {
  const userTabs = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'find-vet', label: 'Find Vet' },
    { id: 'pets', label: 'My Pets' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'history', label: 'Health Records' },
    { id: 'support', label: 'Support' },
  ];

  const doctorTabs = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'appointments', label: 'My Schedule' },
    { id: 'patients', label: 'Health Records' },
    { id: 'profile', label: 'Professional Profile' },
  ];

  const tabs = isDoctor ? doctorTabs : userTabs;

  return (
    <nav className="top-navbar">
      <div className="nav-left">
        <div className="nav-logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PetCare</span>
        </div>
        <div className="nav-links">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="nav-right">
        <button className="nav-icon-btn" onClick={() => setActiveTab('notifications')}>
          <span className="notif-badge"></span>
          🔔
        </button>
        <div className="user-profile-dropdown" onClick={() => { if (window.confirm('Logout?')) onLogout(); }}>
          <div className="user-avatar-circle">
            {user?.firstName?.charAt(0) || 'R'}
          </div>
          <span className="chevron">▼</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
