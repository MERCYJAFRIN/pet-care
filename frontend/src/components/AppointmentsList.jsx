import React, { useState, useEffect } from 'react';
import { appointmentService, petService, paymentService, doctorService, notificationService } from '../services/authService';
import '../styles/appointments.css';

const AppointmentsList = ({ preselectedDoctor = null, onClearSelection = null }) => {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    petId: '',
    doctorId: '',
    veterinarian: '',
    clinicName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    serviceType: 'vet_consultation',
    serviceMode: 'online', // online or offline
    notes: '',
  });

  useEffect(() => {
    fetchAppointmentsAndPets();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (preselectedDoctor) {
      setFormData(prev => ({
        ...prev,
        doctorId: preselectedDoctor.id,
        veterinarian: `Dr. ${preselectedDoctor.User.firstName} ${preselectedDoctor.User.lastName}`,
        clinicName: preselectedDoctor.clinicName || '',
      }));
      setShowForm(true);
    }
  }, [preselectedDoctor]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchAppointmentsAndPets = async () => {
    try {
      setLoading(true);
      setError('');
      const [appointmentsRes, petsRes] = await Promise.all([
        appointmentService.getAppointments(),
        petService.getPets(),
      ]);

      const appointmentsData = appointmentsRes.data?.appointments || appointmentsRes.data || [];
      const petsData = petsRes.data?.pets || petsRes.data || [];

      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setPets(Array.isArray(petsData) ? petsData : []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Server Error: Failed to fetch data. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dateTime = `${formData.appointmentDate}T${formData.appointmentTime}`;
      
      // Use the doctor's preferred Zoom link as a template for online consultations
      let meetLink = null;
      if (formData.serviceMode === 'online') {
        meetLink = 'https://us04web.zoom.us/j/76056977589?pwd=7bcLb9Ub1C3tdOZI5AAxuwmlUszRxw.1';
      }

      const data = { ...formData, appointmentDate: dateTime, meetLink };
      
      if (editingId) {
        await appointmentService.updateAppointment(editingId, data);
      } else {
        await appointmentService.createAppointment(data);
      }

      setShowForm(false);
      setEditingId(null);
      if (onClearSelection) onClearSelection();
      fetchAppointmentsAndPets();
    } catch (err) {
      setError('Failed to save appointment. Please try again.');
    }
  };

  const handleEdit = (appt) => {
    const date = new Date(appt.appointmentDate);
    setFormData({
      petId: appt.petId || '',
      doctorId: appt.doctorId || '',
      veterinarian: appt.veterinarian || '',
      clinicName: appt.clinicName || '',
      appointmentDate: date.toISOString().split('T')[0],
      appointmentTime: date.toTimeString().slice(0, 5),
      reason: appt.description || '',
      serviceType: appt.serviceType || 'vet_consultation',
      serviceMode: appt.meetLink ? 'online' : 'offline',
      notes: appt.notes || '',
    });
    setEditingId(appt.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Do you want to delete this appointment?')) {
      try {
        await appointmentService.deleteAppointment(id);
        fetchAppointmentsAndPets();
      } catch (err) {
        setError('Delete failed');
      }
    }
  };

  const handlePayment = async (appt) => {
    try {
      const res = await paymentService.createOrder(appt.id, appt.fee || 500, `Booking for ${getPetName(appt.petId)}`);
      const { orderId, amount, currency } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'PetCare - Premium Consultation',
        description: `Video Consultation with ${appt.veterinarian}`,
        image: 'https://cdn-icons-png.flaticon.com/512/2138/2138440.png',
        order_id: orderId,
        handler: async (response) => {
          await paymentService.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            appt.id
          );
          alert('Success! Your consultation is confirmed.');
          fetchAppointmentsAndPets();
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').firstName || '',
          email: JSON.parse(localStorage.getItem('user') || '{}').email || '',
        },
        theme: { color: '#6366f1' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Payment failed');
    }
  };

  const [isReviewing, setIsReviewing] = useState(false);

  const handleBookClick = (e) => {
    e.preventDefault();
    if (!formData.petId || !formData.doctorId || !formData.appointmentDate) {
      setError('Please fill in all required fields');
      return;
    }
    setIsReviewing(true);
    setError('');
  };

  const handleFinalConfirm = async () => {
    try {
      await handleSubmit({ preventDefault: () => {} });
      setIsReviewing(false);
      setShowForm(false);
      
      // Auto-trigger a notification about the booked appointment
      try {
         await notificationService.createNotification({
            notificationType: 'appointment_booked',
            title: 'Appointment Booked Successfully',
            message: `Your appointment with ${formData.veterinarian} has been scheduled for ${new Date(formData.appointmentDate).toLocaleString()}`,
            petId: formData.petId
         });
      } catch (e) {
         console.error('Could not create notification:', e);
      }

      setEditingId(null);
      if (onClearSelection) onClearSelection();
      fetchAppointmentsAndPets();
    } catch (err) {
      setError('Booking failed. Please try again.');
    }
  };

  const getPetName = (id) => pets.find(p => p.id === id)?.name || 'Unknown';
  const getDoctorConsultationFee = (doctorId) => doctors.find(d => d.id === doctorId)?.consultationFee || 500;


  if (loading && appointments.length === 0) return <div className="loading">🐾 Fetching your appointments...</div>;

  const getStatusClass = (status) => {
    const s = status?.toLowerCase() || 'awaiting';
    if (s.includes('confirm')) return 'confirmed';
    if (s.includes('await')) return 'awaiting';
    if (s.includes('cancel')) return 'cancelled';
    if (s.includes('complete')) return 'completed';
    return 'awaiting';
  };

  return (
    <div className="appointments-view animate-fade-in">
      {!showForm ? (
        <>
          <div className="view-header">
            <div>
              <h1 style={{ color: '#fff' }}>My Appointments</h1>
            </div>
            <button onClick={() => { setShowForm(true); setIsReviewing(false); }} className="btn-new-appt">
              <span>+ Book Appointment</span>
            </button>
          </div>

          <div className="appointments-table-container">
            <table className="appt-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Pet</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>No appointments found.</td>
                  </tr>
                ) : (
                  appointments.map(appt => (
                    <tr key={appt.id}>
                      <td>
                        <div className="doctor-cell">
                          <div className="doctor-avatar-sm">
                            {appt.veterinarian?.split(' ').map(n => n[0]).join('') || 'DR'}
                          </div>
                          <div className="doctor-info">
                            <h4>{appt.veterinarian}</h4>
                            <p>{appt.serviceType?.replace('_', ' ')}</p>
                            {appt.meetLink && (
                              <div className="meet-link-cell" style={{ marginTop: '8px' }}>
                                <a href={appt.meetLink} target="_blank" rel="noopener noreferrer" className="btn-join-zoom">
                                  📹 Join Meeting
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="pet-cell">{getPetName(appt.petId)}</div>
                      </td>
                      <td>
                        <div className="date-time-cell">
                          {new Date(appt.appointmentDate).toISOString().split('T')[0]}
                          <span>{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td>
                        <div className="type-cell">
                          <span className="type-icon">🏢</span>
                          {appt.clinicName || 'Clinic'}
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${getStatusClass(appt.status)}`}>
                          {appt.status || 'Awaiting Vet'}
                        </span>
                      </td>
                      <td>
                        <span className="action-link" onClick={() => handleEdit(appt)}>Details</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : isReviewing ? (
        <div className="confirm-card-wrapper">
          <div className="view-header">
            <h1 style={{ color: '#fff' }}>Review Appointment</h1>
          </div>
          <div className="confirm-card">
            <h2 className="confirm-title" style={{ color: '#fff' }}>Confirm your Booking Details</h2>
            <div className="confirm-details">
              <div className="confirm-item">
                <span className="confirm-label">Patient (Pet)</span>
                <span className="confirm-value" style={{ color: '#fff' }}>🐾 {getPetName(formData.petId)}</span>
              </div>
              <div className="confirm-item">
                <span className="confirm-label">Mode</span>
                <span className="confirm-value" style={{ color: '#fff', textTransform: 'capitalize' }}>
                  {formData.serviceMode === 'online' ? '📹 Online (Zoom)' : '🏥 Offline (In-Clinic)'}
                </span>
              </div>
              <div className="confirm-item">
                <span className="confirm-label">Doctor</span>
                <span className="confirm-value" style={{ color: '#fff' }}>🩺 {formData.veterinarian}</span>
              </div>
              <div className="confirm-item">
                <span className="confirm-label">Date & Time</span>
                <span className="confirm-value" style={{ color: '#fff' }}>📅 {new Date(formData.appointmentDate).toLocaleString()}</span>
              </div>
              <div className="confirm-item">
                <span className="confirm-label">Clinic</span>
                <span className="confirm-value" style={{ color: '#fff' }}>🏢 {formData.clinicName}</span>
              </div>
              
              <div className="price-summary-box">
                <div className="total-summary-row">
                  <span>Consultation Fee</span>
                  <span>₹{getDoctorConsultationFee(formData.doctorId)}.00</span>
                </div>
              </div>
            </div>

            <div className="booking-actions">
              <button className="btn-back-step" onClick={() => setIsReviewing(false)}>Edit Details</button>
              <button className="btn-confirm-final" onClick={handleFinalConfirm}>Confirm & Pay ₹{getDoctorConsultationFee(formData.doctorId)}</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="booking-workflow">
          <div className="view-header">
            <h1 style={{ color: '#fff' }}>{editingId ? 'Edit Appointment' : 'Book Appointment'}</h1>
          </div>

          <div className="booking-form-container">
            <form onSubmit={handleBookClick} className="appointment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Select Pet</label>
                  <select name="petId" value={formData.petId} onChange={handleChange} required>
                    <option value="">Choose a pet</option>
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Doctor</label>
                  <select 
                    name="doctorId" 
                    value={formData.doctorId} 
                    onChange={(e) => {
                      const doc = doctors.find(d => d.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        doctorId: e.target.value,
                        veterinarian: doc ? `Dr. ${doc.User?.firstName || ''} ${doc.User?.lastName || ''}` : '',
                        clinicName: doc?.clinicName || ''
                      });
                    }}
                    disabled={!!preselectedDoctor}
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        Dr. {doc.User?.firstName || ''} {doc.User?.lastName || ''} ({doc.specialization || 'General Vet'}) {doc.isVerified ? '✓ Verified' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Date & Time</label>
                  <input
                    type="datetime-local"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Reason for Visit</label>
                  <input 
                    type="text"
                    name="reason" 
                    value={formData.reason} 
                    onChange={handleChange} 
                    placeholder="Briefly describe the issue..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Consultation Mode</label>
                  <select name="serviceMode" value={formData.serviceMode} onChange={handleChange} required>
                    <option value="online">📹 Online (Video Call)</option>
                    <option value="offline">🏥 Offline (In-Clinic)</option>
                  </select>
                </div>
              </div>

              {error && <div className="error-banner">{error}</div>}

              <div className="booking-actions">
                <button type="button" className="btn-back-step" onClick={() => { setShowForm(false); if(onClearSelection) onClearSelection(); }}>Cancel</button>
                <button type="submit" className="btn-confirm-final">Review Appointment Details</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
