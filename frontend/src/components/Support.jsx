import React from 'react';
import '../styles/dashboard.css';

const Support = () => {
  const contactInfo = [
    { icon: '📞', label: 'Clinic Number', detail: '+91 98765 43210', sub: 'Mon-Sun, 9am - 8pm' },
    { icon: '✉️', label: 'Mail Us', detail: 'support@petcareclinic.com', sub: '24/7 Response' },
    { icon: '📍', label: 'Location', detail: '123 Pet Lane, Health City', sub: 'Main Street Gateway' },
  ];

  return (
    <div className="overview-container animate-fade-in">
      <header className="overview-header">
        <div className="greeting-section">
          <h1>Customer Support</h1>
          <p>We're here to help you and your furry friends.</p>
        </div>
      </header>

      <div className="stats-grid">
        {contactInfo.map((item, index) => (
          <div key={index} className="stat-card animate-scale-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="card-icon-round">
              <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
            </div>
            <div className="card-content">
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</p>
              <h3 style={{ margin: '5px 0', fontSize: '1.3rem' }}>{item.detail}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card animate-slide-in" style={{ padding: '30px', marginTop: '30px', background: 'rgba(255, 28, 124, 0.05)', border: '1px dashed var(--primary)' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🚑</div>
          <div>
            <h2 style={{ margin: 0, color: 'var(--primary)' }}>Emergency Care</h2>
            <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>For life-threatening emergencies, please call our 24h hotline: <strong>1800-PET-EMERGENCY</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
