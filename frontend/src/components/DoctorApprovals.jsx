import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axiosInstance from '../services/api';
import '../styles/doctor-approvals.css';

const DoctorApprovals = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, [activeTab]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      // In a real app we'd fetch based on status
      const response = await axiosInstance.get('/admin/doctors');
      const allDocs = response.data.doctors || [];
      
      const filtered = allDocs.filter(d => {
        if (activeTab === 'pending') return !d.isVerified && d.verificationStatus !== 'rejected';
        if (activeTab === 'approved') return d.isVerified;
        if (activeTab === 'rejected') return d.verificationStatus === 'rejected';
        return true;
      });
      setDoctors(filtered);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
      // For demo, load mock data if API fails
      if(activeTab === 'pending'){
        setDoctors([{ id: 1, User: { firstName: 'Sarah', lastName: 'Connor' }, specialization: 'Dermatology', experience: '5', clinicAddress: '123 Pet St', documentUrl: 'sample.pdf' }]);
      } else {
        setDoctors([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (docId, status) => {
    try {
      await axiosInstance.put(`/admin/doctors/${docId}/verify`, { status });
      fetchDoctors();
    } catch (err) {
      alert('Failed to update doctor status');
    }
  };

  const renderDoctorCard = (doc) => (
    <div key={doc.id} className="approval-card pop-in">
      <div className="approval-header">
         <div className="doc-avatar">{doc.User?.firstName?.charAt(0) || 'D'}</div>
         <div>
            <h3 className="doc-name">Dr. {doc.User?.firstName} {doc.User?.lastName}</h3>
            <span className="doc-spec">{doc.specialization} • {doc.experience} yrs exp</span>
         </div>
      </div>
      
      <div className="approval-details">
        <p><strong>Clinic:</strong> {doc.clinicAddress || 'Not Provided'}</p>
        <div className="doc-documents">
           <strong>Documents:</strong>
           {doc.documentUrl ? (
             <a href={doc.documentUrl} target="_blank" rel="noreferrer" className="doc-link">📄 View License/Certificate</a>
           ) : (
             <span className="no-doc">No documents uploaded</span>
           )}
        </div>
      </div>

      {activeTab === 'pending' && (
        <div className="approval-actions">
           <button className="btn-approve pop" onClick={() => handleUpdateStatus(doc.id, 'approved')}>✓ Approve</button>
           <button className="btn-reject pop" onClick={() => handleUpdateStatus(doc.id, 'rejected')}>✕ Reject</button>
        </div>
      )}
      {activeTab === 'approved' && (
         <div className="approval-status-label approved">✓ Verified & Active</div>
      )}
      {activeTab === 'rejected' && (
         <div className="approval-status-label rejected">✕ Application Rejected</div>
      )}
    </div>
  );

  return (
    <div className="approvals-page-container">
      <Navbar user={user} activeTab="approvals" setActiveTab={() => {}} onLogout={onLogout} />
      
      <main className="approvals-main">
        <div className="approvals-header-section pop-in">
          <h1>👨‍⚕️ Doctor Approvals</h1>
          <p>Review and verify new veterinary registrations.</p>
        </div>

        <div className="approvals-tabs pop-in">
          <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>
            ⏳ Pending Requests
          </button>
          <button className={activeTab === 'approved' ? 'active' : ''} onClick={() => setActiveTab('approved')}>
            ✅ Approved Doctors
          </button>
          <button className={activeTab === 'rejected' ? 'active' : ''} onClick={() => setActiveTab('rejected')}>
            ❌ Rejected
          </button>
        </div>

        <div className="approvals-grid">
          {loading ? (
             <p className="loading-text">Loading doctors...</p>
          ) : doctors.length === 0 ? (
             <div className="empty-state">
               <span style={{ fontSize: '3rem', opacity: 0.5 }}>📂</span>
               <p>No {activeTab} doctor requests found.</p>
             </div>
          ) : (
            doctors.map(renderDoctorCard)
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorApprovals;
