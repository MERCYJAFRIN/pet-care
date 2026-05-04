import React, { useState, useEffect } from 'react';
import { doctorService, appointmentService, authService, medicalHistoryService } from '../services/authService';
import Navbar from '../components/Navbar';
import axiosInstance from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../styles/dashboard.css';
import '../styles/appointments.css';
import '../styles/doctor-dashboard.css';
import DoctorProfileForm from '../components/DoctorProfileForm';
import WritePrescriptionModal from '../components/WritePrescriptionModal';
import NotificationsPage from '../components/NotificationsPage';

const HealthHistoryChart = ({ history }) => {
  if (!history || history.length === 0) return null;

  // Transform records for charting (e.g., cost or numeric indicators if available)
  // For now, we'll plot visit frequency or mock some data if records don't have numeric metrics
  const chartData = history.map(h => ({
    date: new Date(h.visitDate).toLocaleDateString(),
    condition: h.condition,
    severity: h.diagnosis?.length || 0 // Proxy for complexity
  })).reverse();

  return (
    <div className="health-chart-container" style={{ height: '300px', width: '100%', marginTop: '20px', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
      <h4 style={{ marginBottom: '1rem', opacity: 0.8 }}>Health Vitality Index</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
          <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
          <Tooltip
            contentStyle={{ background: '#1a1a2e', border: '1px solid var(--primary)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--primary)' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="severity"
            name="Clinical Complexity"
            stroke="var(--primary)"
            strokeWidth={3}
            dot={{ fill: 'var(--primary)', r: 6 }}
            activeDot={{ r: 8, stroke: 'white', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const DoctorDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [meetLinks, setMeetLinks] = useState({});
  const [prescriptionAppt, setPrescriptionAppt] = useState(null);

  let user = {};
  try {
    const storedUser = localStorage.getItem('user');
    user = (storedUser && storedUser !== 'undefined') ? JSON.parse(storedUser) : {};
  } catch (e) {
    console.error('DoctorDashboard: Failed to parse user', e);
  }

  useEffect(() => {
    checkDoctorProfile();
    fetchDoctorAppointments();
    fetchNotifications();
  }, []);

  const checkDoctorProfile = async () => {
    try {
      const response = await doctorService.getDoctorProfile();
      setProfile(response.data);
      setNeedsProfile(false);
    } catch (err) {
      if (err.response?.status === 404) {
        setNeedsProfile(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorAppointments = async () => {
    try {
      const response = await appointmentService.getDoctorAppointments();
      const appointmentsData = response.data.appointments || [];
      setAppointments(appointmentsData);
      
      // Initialize meet links state
      const links = {};
      appointmentsData.forEach(appt => {
        if (appt.meetLink) links[appt.id] = appt.meetLink;
      });
      setMeetLinks(links);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications/unread');
      setNotifications(response.data.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const fetchPatientHistory = async (petId) => {
    setLoadingHistory(true);
    try {
      const response = await medicalHistoryService.getMedicalHistory(petId);
      setPatientHistory(response.data.records || []);
    } catch (err) {
      console.error('Error fetching patient history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await appointmentService.updateAppointmentStatusByDoctor(appointmentId, { status });
      fetchDoctorAppointments();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleUpdateMeetLink = async (appointmentId) => {
    try {
      await axiosInstance.put(`/appointments/doctor/${appointmentId}/meet-link`, { 
        meetLink: meetLinks[appointmentId] 
      });
      fetchDoctorAppointments();
      alert('Meeting link updated successfully');
    } catch (err) {
      alert('Failed to update meeting link');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    try {
      await axiosInstance.post('/auth/verify-doctor', { email: user.email, code: verificationCode });
      checkDoctorProfile();
      alert('Account verified successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleProfileComplete = () => {
    setNeedsProfile(false);
    setIsEditingProfile(false);
    checkDoctorProfile();
  };

  if (loading) return <div className="loading">Checking professional credentials...</div>;

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'scheduled') return 'status-pill awaiting';
    if (s === 'confirmed') return 'status-pill confirmed';
    if (s === 'completed') return 'status-pill completed';
    if (s === 'cancelled') return 'status-pill cancelled';
    return 'status-pill awaiting';
  };

  const renderAppointments = () => {
    const pendingConsultations = appointments.filter(a => a.status === 'scheduled');
    const activeConsultations = appointments.filter(a => a.status === 'confirmed' || a.status === 'completed' || a.status === 'paid');
    const cancelledConsultations = appointments.filter(a => a.status === 'cancelled' || a.status === 'rejected');
    
    // Derived unique pets from patients
    const vaults = Array.from(new Set(appointments.map(a => a.Pet?.id)))
      .map(id => appointments.find(a => a.Pet?.id === id)?.Pet)
      .filter(p => !!p);

    return (
    <div className="doctor-dashboard animate-fade-in">
      
      {/* Pending Consultations */}
      <div className="appointments-section">
        <h2>🔔 Pending Requests ({pendingConsultations.length})</h2>
        <div className="appointments-list">
          {pendingConsultations.length === 0 ? (
            <p style={{ opacity: 0.6, padding: '1rem' }}>No pending requests.</p>
          ) : (
            pendingConsultations.map(appt => (
              <div key={appt.id} className="appt-card-modern awaiting">
                <div className="appt-header">
                  <span className="appt-pet-name">
                    Owner: {appt.User?.firstName || 'Pet'} {appt.User?.lastName || 'Owner'}
                  </span>
                  <span className="appt-status-badge badge-awaiting">NEW REQUEST</span>
                </div>
                
                <div className="appt-details-modern">
                  <div className="detail-row">
                     🐾 <strong>Pet:</strong> {appt.Pet?.name || 'Unknown'}
                  </div>
                  <div className="detail-row">
                    🗓️ <strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toISOString().split('T')[0] : 'TBD'}
                  </div>
                  <div className="detail-row" style={{ color: '#f59e0b', fontWeight: 500 }}>
                    ⏰ <strong>Time:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM'}
                  </div>
                  <div className="detail-row" style={{ marginTop: '0.5rem', fontStyle: 'italic', opacity: 0.8 }}>
                    <strong>Reason:</strong> {appt.description || 'No reason provided'}
                  </div>
                  {appt.meetLink && (
                    <div className="detail-row" style={{ marginTop: '0.5rem', color: '#6366f1', fontSize: '0.85rem' }}>
                      📹 <strong>Mode:</strong> Online Consultation (Auto-Zoom Link Generated)
                    </div>
                  )}
                </div>

                <div className="appt-actions-modern" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn-appt-primary" onClick={() => handleUpdateStatus(appt.id, 'confirmed')} style={{ padding: '0.8rem', fontSize: '0.9rem' }}>
                    ✅ Accept
                  </button>
                  <button className="btn-appt-danger" onClick={() => handleUpdateStatus(appt.id, 'rejected')} style={{ padding: '0.8rem', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Consultations */}
      <div className="appointments-section" style={{ marginTop: '2rem' }}>
        <h2>📅 Active Consultations</h2>
        <div className="appointments-list">
          {activeConsultations.length === 0 ? (
            <p style={{ opacity: 0.6, padding: '1rem' }}>No active consultations.</p>
          ) : (
            activeConsultations.map(appt => (
                 <div key={appt.id} className={`appt-card-modern ${appt.status === 'confirmed' ? 'accepted' : 'completed'}`}>
                <div className="appt-header">
                  <span className="appt-pet-name">
                    Owner: {appt.User?.firstName || 'Pet'} {appt.User?.lastName || 'Owner'}
                  </span>
                  <span className={`appt-status-badge badge-${appt.status === 'confirmed' ? 'accepted' : 'completed'}`}>
                    {appt.status === 'confirmed' ? 'ACCEPTED' : 'PAID'}
                  </span>
                </div>
                
                <div className="appt-details-modern">
                  <div className="detail-row">
                     🐾 <strong>Pet:</strong> {appt.Pet?.name || 'Unknown'}
                  </div>
                  <div className="detail-row">
                    🗓️ <strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toISOString().split('T')[0] : 'TBD'}
                  </div>
                  <div className="detail-row" style={{ color: '#38bdf8', fontWeight: 500 }}>
                    ⏰ <strong>Time:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM'}
                  </div>
                  <div className="detail-row" style={{ marginTop: '0.5rem', fontStyle: 'italic', opacity: 0.8 }}>
                    <strong>Reason:</strong> {appt.description || 'No reason provided'}
                  </div>
                  <div className="detail-row" style={{ marginTop: '0.5rem' }}>
                    {appt.meetLink ? (
                      <div style={{ color: '#6366f1', fontSize: '0.9rem' }}>
                        📹 <strong>Online Zoom Session: </strong>
                        <a href={appt.meetLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{appt.meetLink}</a>
                      </div>
                    ) : (
                      <div style={{ color: '#10b981', fontSize: '0.9rem' }}>
                        🏥 <strong>Offline (In-Clinic) Session</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="payment-status">
                  ✓ Payment Successful
                </div>

                <div className="appt-actions-modern" style={{ flexDirection: 'column' }}>
                  <button className="btn-appt-success" style={{ marginBottom: '0.5rem' }} onClick={() => setPrescriptionAppt(appt)}>
                    ✍️ Write Prescription
                  </button>
                  
                  <div className="meet-link-update-group" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="Enter Zoom/Meet Link"
                      className="meet-link-input"
                      value={meetLinks[appt.id] || ''}
                      onChange={(e) => setMeetLinks({ ...meetLinks, [appt.id]: e.target.value })}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                    />
                    <button 
                      className="btn-appt-primary" 
                      onClick={() => handleUpdateMeetLink(appt.id)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      💾 Save Link
                    </button>
                  </div>

                  {appt.meetLink && (
                     <a href={appt.meetLink} target="_blank" rel="noopener noreferrer" className="btn-appt-primary" style={{ display: 'block', textAlign: 'center', fontWeight: 'bold', background: '#4c1d95' }}>
                       🚀 Start Zoom Meeting (Host)
                     </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cancelled / Rejected */}
      <div className="appointments-section" style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#ef4444' }}>❌ Cancelled / Rejected</h2>
        <div className="appointments-list">
          {cancelledConsultations.length === 0 ? (
            <p style={{ opacity: 0.6, padding: '1rem' }}>No cancelled consultations.</p>
          ) : (
            cancelledConsultations.map(appt => (
              <div key={appt.id} className="appt-card-modern cancelled">
                <div className="appt-header">
                  <span className="appt-pet-name">
                    Owner: {appt.User?.firstName || 'Pet'} {appt.User?.lastName || 'Owner'}
                  </span>
                  <span className="appt-status-badge badge-cancelled">{appt.status.toUpperCase()}</span>
                </div>
                
                <div className="appt-details-modern">
                  <div className="detail-row">
                     🐾 <strong>Pet:</strong> {appt.Pet?.name || 'Unknown'}
                  </div>
                  <div className="detail-row">
                    🗓️ <strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toISOString().split('T')[0] : 'TBD'}
                  </div>
                  <div className="detail-row" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '1rem' }}>
                    ℹ️ This appointment was cancelled by the doctor or clinic.
                  </div>
                </div>

                <button style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '0.8rem', cursor: 'pointer', marginTop: '1rem' }}>
                  Clear from History
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Write Prescription Modal */}
      {prescriptionAppt && (
        <WritePrescriptionModal
          appointment={prescriptionAppt}
          onClose={() => setPrescriptionAppt(null)}
        />
      )}

    </div>
    );
  };

  const renderPatients = () => {
    // Derived unique pets from patients for Health Records tab
    const vaults = Array.from(new Set(appointments.map(a => a.Pet?.id)))
      .map(id => appointments.find(a => a.Pet?.id === id)?.Pet)
      .filter(p => !!p);

    return (
      <div className="doctor-dashboard animate-fade-in">
        {/* Pets Vaults */}
        <div className="doctor-patients-tab">
          <h2>🐾 Pets & Health Records</h2>
          <div className="patients-vault-grid">
             {vaults.map(pet => (
               <div key={pet.id} className="vault-card">
                 <div className="vault-header-actions" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                   <div className={`vault-avatar ${pet.name.charAt(0).toUpperCase()}`}>{pet.name.charAt(0).toUpperCase()}</div>
                   <div style={{ display: 'flex', gap: '0.5rem', color: '#f97316' }}>
                      <span>✏️</span>
                      <span>🗑️</span>
                   </div>
                 </div>
                 
                 {/* Display Pet image if available instead of avatar block */}
                 {pet.imageUrl ? (
                    <img src={pet.imageUrl} alt={pet.name} style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', marginBottom: '1rem' }} />
                 ) : (
                    <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${pet.name}&backgroundColor=38bdf8`} alt={pet.name} style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', marginBottom: '1rem' }} />
                 )}

                 <h3 className="vault-name">{pet.name}</h3>
                 <p className="vault-details">{pet.breed || 'Mixed Breed'} • {pet.age || '1'} yrs</p>
                 
                 <button className="btn-open-vault" onClick={() => { setSelectedPatient(pet); fetchPatientHistory(pet.id); }}>
                   📑 Open Medical Vault
                 </button>
               </div>
             ))}
             {vaults.length === 0 && (
               <p style={{ opacity: 0.6 }}>No patients registered yet. Health records will appear here.</p>
             )}
          </div>
        </div>

        {/* Simple Vault Modal */}
        {selectedPatient && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
             <div className="vault-modal-content card" style={{ background: 'white', width: '90%', maxWidth: '500px', borderRadius: '20px', padding: '2rem', position: 'relative' }}>
                <button className="modal-close-x" onClick={() => setSelectedPatient(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
                
                <div className="vault-header">
                  <span style={{ color: '#ec4899' }}>📑</span> {selectedPatient.name}'s Vault
                </div>
                
                <div className="vault-info" style={{ color: '#334155' }}>
                  <p><strong>Breed:</strong> {selectedPatient.breed || 'Unknown'}</p>
                  <p><strong>Age:</strong> {selectedPatient.age || 'N/A'} Years</p>
                  <p><strong>Weight:</strong> {selectedPatient.weight || 'N/A'} Kg</p>
                </div>

                <div className="vault-section">
                  <h4 style={{ color: '#3b82f6' }}>💉 Vaccination Tracker:</h4>
                  <ul className="tracker-list" style={{ listStyle: 'none', paddingLeft: '1.5rem', color: '#475569' }}>
                     <li>• Rabies: <span className="completed">✅ Completed</span></li>
                     <li>• DHPP: <span className="completed">✅ Completed</span></li>
                     <li>• Parvovirus: <span className="pending">⏳ Next due: June 2026</span></li>
                  </ul>
                </div>

                <div className="vault-section" style={{ borderTop: 'none', paddingTop: 0 }}>
                   <h4 style={{ color: '#ef4444' }}>🍎 Fav Food: <span style={{ fontWeight: 400, color: '#475569' }}>Chicken Jerky / Pedigree Puppy</span></h4>
                </div>

                <div className="medical-history-box">
                   <h4 style={{ color: '#f59e0b', marginBottom: '0.5rem', fontSize: '1rem' }}>📋 Medical History:</h4>
                   {loadingHistory ? (
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Loading records...</p>
                   ) : patientHistory && patientHistory.length > 0 ? (
                      <ul style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, paddingLeft: '1.2rem' }}>
                         {patientHistory.map((h, i) => (
                            <li key={i}>
                               <strong>{new Date(h.visitDate).toLocaleDateString()}:</strong> {h.condition} 
                               {h.diagnosis && ` - ${h.diagnosis.join(', ')}`}
                            </li>
                         ))}
                      </ul>
                   ) : (
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>No medical history records found for this pet.</p>
                   )}
                </div>

                <button className="btn-close-vault" onClick={() => setSelectedPatient(null)}>Close Vault</button>
             </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="onboarding-view animate-fade-in">
      <DoctorProfileForm
        onComplete={handleProfileComplete}
        initialData={profile}
      />
    </div>
  );

  const renderOverview = () => {
    const isVerified = profile?.User?.isVerified || profile?.isVerified;
    const newRequests = appointments.filter(a => a.status === 'scheduled');

    return (
      <div className="doctor-dashboard animate-fade-in">
        <div className="doctor-welcome">
          <div className="welcome-text">
            <h1>Welcome, Dr. {profile?.User?.firstName || user.firstName} {profile?.User?.lastName || user.lastName} <span style={{ color: 'var(--primary)' }}>🩺</span></h1>
            <p>Manage your patient requests and schedule.</p>
          </div>
          <div className="doctor-actions-top">
            <span className="rating-badge">
              ⭐ 0.0 (0 reviews)
            </span>
            <button style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="stats-grid-doctor">
          <div className="stat-card-doc">
            <span className="stat-title">Total Patients</span>
            <span className="stat-value"><span style={{ color: '#8b5cf6' }}>👥</span> 5</span>
          </div>
          <div className="stat-card-doc">
            <span className="stat-title">Confirmed/Paid</span>
            <span className="stat-value"><span style={{ color: '#10b981' }}>✅</span> {appointments.filter(a => a.status === 'confirmed' || a.status === 'completed' || a.status === 'paid').length}</span>
          </div>
          <div className="stat-card-doc">
            <span className="stat-title">New Requests</span>
            <span className="stat-value"><span style={{ color: '#f59e0b' }}>⏳</span> {newRequests.length}</span>
          </div>
          <div className="stat-card-doc">
            <span className="stat-title">Total Earnings</span>
            <span className="stat-value"><span style={{ color: '#f59e0b' }}>💰</span> ₹500</span>
          </div>
        </div>

        <div className="dashboard-content-grid">
          <div className="appointments-section">
            <h2>Patient Appointments</h2>
            <div className="appointments-list">
               {newRequests.length === 0 && <p style={{ color: '#64748b' }}>No pending new requests.</p>}
               {newRequests.map(appt => (
                 <div key={appt.id} className="appt-card-modern accepted">
                    <div className="appt-header">
                      <span className="appt-pet-name">🐾 {appt.Pet?.name}</span>
                      <span className="appt-status-badge badge-accepted">ACCEPTED</span>
                    </div>
                    
                    <div className="appt-details-modern">
                      <div className="detail-row">
                         👤 <strong>Owner:</strong> {appt.User?.firstName}
                      </div>
                      <div className="detail-row">
                        🗓️ <strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toISOString().split('T')[0] : 'TBD'}
                      </div>
                      <div className="detail-row">
                        📍 <strong>Type:</strong> Offline Visit
                      </div>
                      <div className="detail-row" style={{ color: '#38bdf8', fontWeight: 500, marginTop: '0.5rem' }}>
                        ⏰ <strong>Time:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM'}
                      </div>
                    </div>

                    <div className="appt-actions-modern">
                      <button className="btn-appt-secondary" onClick={() => handleUpdateStatus(appt.id, 'confirmed')}>Edit Time/Link</button>
                      <button className="btn-appt-danger" onClick={() => handleUpdateStatus(appt.id, 'cancelled')}>Cancel</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="reminders-section">
            <div className="reminders-panel">
              <h3>🔔 Reminders</h3>
              <div className="reminder-list">
                 {appointments.filter(a => a.status === 'confirmed').slice(0, 3).map(appt => (
                    <div key={appt.id} className="reminder-item">
                       <div className="reminder-title">{appt.Pet?.name} ()</div>
                       <div className="reminder-time">
                         {appt.appointmentDate ? new Date(appt.appointmentDate).toISOString().split('T')[0] : 'TBD'} at {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                       </div>
                    </div>
                 ))}
                 {appointments.filter(a => a.status === 'confirmed').length === 0 && (
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No upcoming confirmed reminders.</p>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        isDoctor={true}
      />

      <main className="dashboard-main">
        <div className="content-scroll" style={{ padding: '2rem' }}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'patients' && renderPatients()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'notifications' && <NotificationsPage user={user} onLogout={onLogout} />}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
