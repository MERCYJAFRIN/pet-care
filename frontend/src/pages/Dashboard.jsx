import React, { useState, useEffect } from 'react';
import PetsList from '../components/PetsList';
import MedicalHistory from '../components/MedicalHistory';
import AppointmentsList from '../components/AppointmentsList';
import Marketplace from '../components/Marketplace';
import Overview from '../components/Overview';
import FindVet from '../components/FindVet';
import Support from '../components/Support';
import Navbar from '../components/Navbar';
import NotificationsPage from '../components/NotificationsPage';
import '../styles/dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [tokenWarning, setTokenWarning] = useState('');
  
  let user = {};
  try {
    const storedUser = localStorage.getItem('user');
    user = (storedUser && storedUser !== 'undefined') ? JSON.parse(storedUser) : {};
  } catch (e) {
    console.error('Dashboard: Failed to parse user', e);
  }
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setTokenWarning('Authentication issue detected. Please relogin.');
    }
  }, [token]);

  const handleLogoutClick = () => {
    localStorage.clear();
    onLogout();
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setActiveTab('appointments');
  };

  return (
    <div className="dashboard-container">
      <Navbar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogoutClick} 
      />

      <main className="dashboard-main">
        {tokenWarning && (
          <div className="warning-banner">{tokenWarning}</div>
        )}

        <div className="content-scroll">
          <div className="animate-fade-in">
            {activeTab === 'overview' && <Overview user={user} onNavigate={setActiveTab} />}
            {activeTab === 'pets' && <PetsList onNavigate={setActiveTab} />}
            {activeTab === 'appointments' && (
              <AppointmentsList 
                preselectedDoctor={selectedDoctor} 
                onClearSelection={() => setSelectedDoctor(null)} 
              />
            )}
            {activeTab === 'history' && <MedicalHistory />}
            {activeTab === 'marketplace' && <Marketplace />}
            {activeTab === 'find-vet' && <FindVet onSelectDoctor={handleSelectDoctor} />}
            {activeTab === 'support' && <Support />}
            {activeTab === 'notifications' && <NotificationsPage user={user} onLogout={onLogout} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
