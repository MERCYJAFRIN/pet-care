import React from 'react';
import '../styles/sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="paw-sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon-paw">🐶</span>
        <span className="logo-text">Paw Track</span>
      </div>

      <div className="sidebar-scroll">
        <div className="sidebar-menu-group">
          <h4 className="menu-group-title">MENU</h4>
          <button className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <span className="icon">⏱️</span> Dashboard
          </button>
          <button className={`sidebar-link ${activeTab === 'pets' ? 'active' : ''}`} onClick={() => setActiveTab('pets')}>
            <span className="icon">🐾</span> Pet profile
          </button>
        </div>

        <div className="sidebar-menu-group">
          <h4 className="menu-group-title">ANALYTICS</h4>
          <button className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <span className="icon">❤️</span> Health monitoring
          </button>
          <button className={`sidebar-link ${activeTab === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveTab('marketplace')}>
            <span className="icon">🛒</span> Marketplace
          </button>
        </div>

        <div className="sidebar-menu-group">
          <h4 className="menu-group-title">SCHEDULE</h4>
          <button className={`sidebar-link ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            <span className="icon">📅</span> Appointments <span className="badge">2</span>
          </button>
          <button className={`sidebar-link ${activeTab === 'find-vet' ? 'active' : ''}`} onClick={() => setActiveTab('find-vet')}>
            <span className="icon">🔍</span> Find Vet
          </button>
        </div>

        <div className="sidebar-menu-group">
          <h4 className="menu-group-title">HELP</h4>
          <button className={`sidebar-link ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
            <span className="icon">⚙️</span> Settings
          </button>
          <button className="sidebar-link">
            <span className="icon">📄</span> Documentation
          </button>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={() => { if(window.confirm('Logout?')) onLogout(); }}>
          <span className="icon">↪️</span> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
