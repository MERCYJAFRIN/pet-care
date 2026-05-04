import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import './styles/app.css';
import './styles/auth.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);
  const [view, setView] = useState('landing'); // 'landing', 'login', 'register'
  const [initialRole, setInitialRole] = useState('user');

  useEffect(() => {
    const token = localStorage.getItem('token');
    let user = {};
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        user = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error('App: Failed to parse user', e);
    }
    
    setIsAuthenticated(!!token);
    setUserRole(user?.role || null);

    if (token) {
      setView('dashboard');
      // Sync role from server
      import('./services/api').then(({ default: axiosInstance }) => {
        axiosInstance.get('/auth/profile').then(res => {
          const updatedUser = res.data?.user;
          if (updatedUser && updatedUser.role !== user?.role) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserRole(updatedUser.role);
            // Removed window.location.reload() to prevent infinite loops
          }
        }).catch(() => { });
      });
    }
  }, []);

  const handleLoginSuccess = () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString || '{}');
    console.log('Login success, user role:', user.role);
    setIsAuthenticated(true);
    setUserRole(user.role || 'user');
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    setView('landing');
  };

  const handleAuthClick = (type, role = 'user') => {
    setInitialRole(role);
    setView(type);
  };

  const renderContent = () => {
    if (isAuthenticated) {
      return userRole === 'doctor' ? (
        <DoctorDashboard onLogout={handleLogout} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      );
    }

    switch (view) {
      case 'login':
        return (
          <AuthPage
            onSuccess={handleLoginSuccess}
            initialRole={initialRole}
            onBack={() => setView('landing')}
          />
        );
      case 'register':
        return (
          <AuthPage
            onSuccess={handleLoginSuccess}
            initialRole={initialRole}
            onBack={() => setView('landing')}
          />
        );
      default:
        return <LandingPage onAuthClick={handleAuthClick} />;
    }
  };

  return (
    <div className="app">
      <div className="floating-paw paw-1">🐾</div>
      <div className="floating-paw paw-2">🐾</div>
      <div className="floating-paw paw-3">🐾</div>
      <div className="floating-paw paw-4">🐾</div>
      {renderContent()}
    </div>
  );
}

export default App;
