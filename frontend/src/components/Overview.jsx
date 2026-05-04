import React, { useState, useEffect } from 'react';
import { petService, appointmentService } from '../services/authService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import '../styles/paw-dashboard.css';

const Overview = ({ user }) => {
  const [stats, setStats] = useState({
    petsCount: 0,
    pets: [],
    appointments: []
  });
  const [selectedPetId, setSelectedPetId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [petsRes, appointmentsRes] = await Promise.all([
        petService.getPets(),
        appointmentService.getAppointments()
      ]);

      const pets = Array.isArray(petsRes.data?.pets) ? petsRes.data.pets : (Array.isArray(petsRes.data) ? petsRes.data : []);
      const appointments = Array.isArray(appointmentsRes.data?.appointments) ? appointmentsRes.data.appointments : (Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
      
      setStats({
        petsCount: pets.length,
        pets: pets,
        appointments: appointments
      });

      if (pets.length > 0 && !selectedPetId) {
        setSelectedPetId(pets[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const getPetStats = (petId) => {
    // Simulated dynamic stats based on petId
    const seed = parseInt(petId.toString().slice(-1), 16) || 0;
    return {
      activity: 20 + (seed * 5) % 80,
      sleep: 60 + (seed * 3) % 40,
      wellness: 45 + (seed * 7) % 55,
      chartData: [
        { name: 'Sep', pulse: 3 + (seed % 4), stress: 2 + (seed % 3) },
        { name: 'Nov', pulse: 2 + (seed % 5), stress: 3 + (seed % 2) },
        { name: 'Dec', pulse: 6 - (seed % 3), stress: 4 - (seed % 2) },
        { name: 'Jan', pulse: 4 + (seed % 2), stress: 2 + (seed % 4) },
      ]
    };
  };

  const currentPetStats = selectedPetId ? getPetStats(selectedPetId) : getPetStats('default');
  const currentPet = stats.pets.find(p => p.id === selectedPetId) || stats.pets[0] || { name: 'Buddy', breed: 'Dog', id: '1' };

  const ringData = (value, color) => [
    { name: 'Value', value: value },
    { name: 'Empty', value: 100 - value },
  ];

  const CircularStat = ({ label, value, color }) => (
    <div className="paw-stat-widget">
      <div>
        <h4 className="widget-label" style={{ color: '#aaa' }}>{label}</h4>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{value}%</div>
      </div>
      <div className="widget-value-circle">
        <PieChart width={80} height={80}>
          <Pie
            data={ringData(value, color)}
            innerRadius={25}
            outerRadius={35}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={450}
          >
            <Cell fill={color} />
            <Cell fill="rgba(255,255,255,0.1)" />
          </Pie>
        </PieChart>
      </div>
    </div>
  );

  if (loading) return <div className="overview-container p-4" style={{ color: '#fff' }}>Loading Monitoring Data...</div>;

  return (
    <div className="paw-overview animate-fade-in">
      <header className="overview-header-minimal" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Monitoring Dashboard</h2>
          <p style={{ color: '#888' }}>Tracking health rates for each of your pets</p>
        </div>
        <div className="pet-switcher-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#aaa', fontSize: '0.9rem', fontWeight: '600' }}>SELECT PET:</span>
          <select 
            value={selectedPetId} 
            onChange={(e) => setSelectedPetId(e.target.value)}
            style={{ 
              background: '#111827', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.1)', 
              padding: '8px 15px', 
              borderRadius: '8px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {stats.pets.map(pet => (
              <option key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</option>
            ))}
            {stats.pets.length === 0 && <option value="">No Pets Found</option>}
          </select>
        </div>
      </header>

      <div className="paw-stats-row">
        <CircularStat label="ACTIVITY" value={currentPetStats.activity} color="#ff4757" />
        <CircularStat label="SLEEP" value={currentPetStats.sleep} color="#2ed573" />
        <CircularStat label="WELLNESS" value={currentPetStats.wellness} color="#ffa502" />
      </div>

      <div className="paw-main-grid">
        <div className="paw-chart-section">
          <div className="section-title-row">
            <h3 className="section-title">HEALTH MONITORING: {(currentPet?.name || 'PET').toUpperCase()}</h3>
            <select className="minimal-select" style={{ background: 'transparent', color: '#888', border: 'none' }}>
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="chart-tabs" style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem' }}>
            <button className="chart-tab active" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '5px' }}>🧠 Stress level</button>
            <button className="chart-tab" style={{ background: 'transparent', color: '#666', border: 'none' }}>💓 Pulse</button>
            <button className="chart-tab" style={{ background: 'transparent', color: '#666', border: 'none' }}>🌡️ Temperature</button>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={currentPetStats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                <Line 
                  type="monotone" 
                  dataKey="pulse" 
                  stroke="#3742fa" 
                  strokeWidth={4} 
                  dot={{ r: 5, fill: '#3742fa' }}
                  activeDot={{ r: 7 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pet-summary-sidebar">
          <div className="paw-table-section" style={{ marginBottom: '1.5rem' }}>
            <div className="section-title-row">
              <h3 className="section-title">VACCINATION</h3>
            </div>
            <table className="paw-vaccination-table">
              <thead>
                <tr>
                  <th>Vaccine</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rabies</td>
                  <td><span className="status-badge status-overdue">Overdue</span></td>
                </tr>
                <tr>
                  <td>Bordetella</td>
                  <td><span className="status-badge status-noncore">Noncore</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pet-mini-card">
            <img 
              src={currentPet.profilePicture || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400"} 
              alt="Pet" 
              className="pet-avatar-large" 
            />
            <div className="pet-info-header">
              <h3 style={{ color: '#fff' }}>{currentPet?.name || 'Buddy'}</h3>
              <span style={{ color: '#ff4757', fontWeight: 'bold' }}>Age: {currentPet.age || '7'}</span>
            </div>
            <p style={{ color: '#888', margin: '5px 0' }}>{currentPet.breed}</p>
          </div>
        </div>
      </div>

      {/* NEW: All Pets Monitoring Summary Section */}
      <div className="paw-chart-section" style={{ marginTop: '2rem' }}>
        <div className="section-title-row">
          <h3 className="section-title">ALL PETS MONITORING SUMMARY</h3>
        </div>
        <div className="all-pets-monitoring-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {stats.pets.map(pet => {
            const petRates = getPetStats(pet.id);
            return (
              <div key={pet.id} className="pet-monitoring-row" style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '15px 20px', 
                borderRadius: '12px',
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
                alignItems: 'center',
                border: selectedPetId === pet.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedPetId(pet.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={pet.profilePicture || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=40"} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff' }}>{pet.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{pet.breed}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '2px' }}>ACTIVITY</div>
                  <div style={{ fontWeight: '800', color: '#ff4757' }}>{petRates.activity}%</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '2px' }}>SLEEP</div>
                  <div style={{ fontWeight: '800', color: '#2ed573' }}>{petRates.sleep}%</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '2px' }}>WELLNESS</div>
                  <div style={{ fontWeight: '800', color: '#ffa502' }}>{petRates.wellness}%</div>
                </div>
              </div>
            );
          })}
          {stats.pets.length === 0 && <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No pets found to monitor.</p>}
        </div>
      </div>
    </div>
  );
};

export default Overview;
