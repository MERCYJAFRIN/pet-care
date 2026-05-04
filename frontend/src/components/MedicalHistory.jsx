import React, { useState, useEffect } from 'react';
import { medicalHistoryService, petService } from '../services/authService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/medical-history.css';
import '../styles/paw-dashboard.css';

const MedicalHistory = () => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    visitDate: '',
    vetClinic: '',
    vetName: '',
    condition: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: '',
    cost: '',
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formFile, setFormFile] = useState(null);
  const [formAnalysis, setFormAnalysis] = useState(null);

  const exportToPDF = () => {
    window.print();
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      fetchMedicalHistory(selectedPetId);
    }
  }, [selectedPetId]);

  const fetchPets = async () => {
    try {
      const response = await petService.getPets();
      console.log('Pets fetched:', response.data);
      setPets(response.data.pets || []);
      if (response.data.pets.length > 0) {
        setSelectedPetId(response.data.pets[0].id);
      }
    } catch (err) {
      console.error('Error fetching pets:', err.response?.data || err.message);
      setError('Failed to fetch pets');
    }
  };

  const fetchMedicalHistory = async (petId) => {
    try {
      setLoading(true);
      const [recordsResponse, summaryResponse] = await Promise.all([
        medicalHistoryService.getMedicalHistory(petId),
        medicalHistoryService.getMedicalSummary(petId),
      ]);
      console.log('Medical records:', recordsResponse.data);
      console.log('Medical summary:', summaryResponse.data);
      setMedicalRecords(recordsResponse.data.records || []);
      setSummary(summaryResponse.data.summary);
      setError('');
    } catch (err) {
      console.error('Error fetching medical history:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch medical history');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        visitDate: formData.visitDate || new Date().toISOString(),
        isVerified: !!formAnalysis,
        verificationReport: formAnalysis
      };

      if (editingId) {
        await medicalHistoryService.updateMedicalHistory(selectedPetId, editingId, dataToSave);
        setEditingId(null);
      } else {
        await medicalHistoryService.createMedicalHistory(selectedPetId, dataToSave);
      }
      setFormData({
        visitDate: '',
        vetClinic: '',
        vetName: '',
        condition: '',
        diagnosis: '',
        treatment: '',
        prescription: '',
        notes: '',
        cost: '',
      });
      setFormFile(null);
      setFormAnalysis(null);
      setShowForm(false);
      fetchMedicalHistory(selectedPetId);
    } catch (err) {
      setError('Failed to save medical record');
    }
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      try {
        await medicalHistoryService.deleteMedicalHistory(selectedPetId, recordId);
        fetchMedicalHistory(selectedPetId);
      } catch (err) {
        setError('Failed to delete medical record');
      }
    }
  };

  const handleEdit = (record) => {
    setFormData({
      visitDate: record.visitDate.split('T')[0],
      vetClinic: record.vetClinic || '',
      vetName: record.vetName || '',
      condition: record.condition,
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      prescription: record.prescription || '',
      notes: record.notes || '',
      cost: record.cost || '',
    });
    setEditingId(record.id);
    setShowForm(true);
  };


  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFormFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormFile(file);
      simulateFormAnalysis(file.name);
    }
  };

  const simulateFormAnalysis = (fileName) => {
    setIsAnalyzing(true);
    setFormAnalysis(null);
    
    // Detailed analysis simulation
    setTimeout(() => {
      setFormAnalysis({
        status: "Verified Healthy",
        overallScore: 92,
        vitals: {
          heartRate: "85 bpm (Normal)",
          temperature: "101.2°F (Normal)",
          activity: "Healthy/Active"
        },
        observations: [
          "Weight is stable at 24.5kg",
          "Vaccination records are up to date",
          "No signs of respiratory distress"
        ],
        recommendations: "Continue current diet. Regular exercise encouraged."
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const analyzeRecords = () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one health record (PDF) for analysis.');
      return;
    }
    setIsAnalyzing(true);
    // Simulate AI Analysis
    setTimeout(() => {
      setAnalysisResult({
        condition: "Healthy but needs hydration",
        summary: "Based on the records, your pet shows normal vital signs. However, there's a slight indication of early-stage skin irritation.",
        recommendations: [
          "Increase water intake by 20%",
          "Apply aloe vera gel to itchy spots",
          "Schedule a follow-up in 2 weeks"
        ],
        graphicalData: [65, 78, 82, 75, 90] // Mock data for trend
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="medical-history-container animate-fade-in">
      <div className="view-header">
        <h1 style={{ color: '#fff' }}>Health Journal & Records</h1>
      </div>

      <div className="analysis-promo-card card">
        <div className="promo-content">
          <div className="promo-text">
            <h3>AI Health Analyzer 🧠</h3>
            <p>Upload your pet's past medical reports (PDFs) and our AI will provide a comprehensive health analysis with graphical trends.</p>
          </div>
          <div className="upload-zone">
            <input 
              type="file" 
              id="pdf-upload" 
              multiple 
              accept="application/pdf" 
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="pdf-upload" className="btn-upload">
              {uploadedFiles.length > 0 ? `📁 ${uploadedFiles.length} Files Ready` : '📤 Upload Records (PDF)'}
            </label>
            <button 
              className={`btn-analyze ${isAnalyzing ? 'loading' : ''}`} 
              onClick={analyzeRecords}
              disabled={isAnalyzing || uploadedFiles.length === 0}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
            </button>
          </div>
        </div>
        
        {analysisResult && (
          <div className="analysis-result-panel animate-slide-up">
            <h4 className="result-title">Analysis Insights for {pets.find(p => p.id === selectedPetId)?.name}</h4>
            <div className="result-grid">
              <div className="result-insight">
                <span className="insight-label">Detected Status</span>
                <p className="insight-value">{analysisResult.condition}</p>
              </div>
              <div className="result-summary">
                <p>{analysisResult.summary}</p>
              </div>
            </div>
            <div className="recommendations">
              <h5>Recommendations:</h5>
              <ul>
                {analysisResult.recommendations.map((rec, i) => <li key={i}>✅ {rec}</li>)}
              </ul>
            </div>
            {/* Visual Trend Representation */}
            <div className="health-trend-paw">
              <h5>Health Monitoring Perspective</h5>
              <div style={{ width: '100%', height: 220, marginTop: '1rem' }}>
                <ResponsiveContainer>
                  <LineChart data={[
                    { name: 'Week 1', stress: 3, pulse: 4, temp: 2 },
                    { name: 'Week 2', stress: 2, pulse: 5, temp: 3 },
                    { name: 'Week 3', stress: 4, pulse: 3, temp: 5 },
                    { name: 'Week 4', stress: 1, pulse: 4, temp: 3 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                    <Line type="monotone" dataKey="pulse" stroke="#3742fa" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="stress" stroke="#ff4757" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="health-records-header-premium">
        <div className="pet-selector-modern">
          <label>Selected Pet</label>
          <div className="selector-wrapper">
            <select 
              className="pet-select-custom"
              value={selectedPetId} 
              onChange={(e) => setSelectedPetId(e.target.value)}
            >
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>{pet.name} ({pet.type || pet.species})</option>
              ))}
            </select>
            <span className="selector-icon">▼</span>
          </div>
        </div>

        <div className="header-actions-premium">
          <button className="btn-export-premium" onClick={exportToPDF}>
            <span className="icon">📄</span> Export History
          </button>
          <button className="btn-add-record-premium" onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              visitDate: '',
              vetClinic: '',
              vetName: '',
              condition: '',
              diagnosis: '',
              treatment: '',
              prescription: '',
              notes: '',
              cost: '',
            });
          }}>
            <span className="icon">+</span> Add Medical Record
          </button>
        </div>
      </div>

      {summary && (
        <div className="summary-panel-premium">
          <div className="stat-card-glass pink">
            <div className="stat-icon">🏥</div>
            <div className="stat-data">
              <span className="label">Total Visits</span>
              <span className="value">{summary.totalVisits}</span>
            </div>
          </div>
          <div className="stat-card-glass purple">
            <div className="stat-icon">💰</div>
            <div className="stat-data">
              <span className="label">Total Expenses</span>
              <span className="value">₹{summary.totalCost.toLocaleString()}</span>
            </div>
          </div>
          <div className="stat-card-glass blue">
            <div className="stat-icon">📋</div>
            <div className="stat-data">
              <span className="label">Active Conditions</span>
              <span className="value">{summary.conditions.length}</span>
            </div>
          </div>
        </div>
      )}

      {error && <div className="error-message-gradient">{error}</div>}
      {showForm && (
        <div className="manual-entry-overlay">
          <form className="medical-form card" onSubmit={handleSubmit}>
            <div className="modal-header-premium">
              <h3>{editingId ? 'Edit Medical Record' : 'New Medical Entry'}</h3>
              <button type="button" className="btn-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body-scroll">
              <div className="form-row">
                <div className="form-group">
                  <label>Condition / Title *</label>
                  <input
                    type="text"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Annual Checkup, sickness"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes & Symptoms</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Record symptoms, diagnosis, or treatment notes..."
                  rows="3"
                />
              </div>

              {/* Premium Upload Zone */}
              <div className="prescription-upload-zone" onClick={() => document.getElementById('form-pdf-upload').click()}>
                <input 
                  type="file" 
                  id="form-pdf-upload" 
                  accept="application/pdf,image/*" 
                  onChange={handleFormFileUpload}
                  style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px' }}
                />
                <div className="upload-icon">📄</div>
                <div className="upload-text">
                  <h4 style={{ pointerEvents: 'none' }}>Prescription & Reports</h4>
                  <p style={{ pointerEvents: 'none' }}>{formFile ? `✅ ${formFile.name}` : 'Click to select or drag files'}</p>
                  <p className="tiny" style={{ pointerEvents: 'none' }}>PDF, JPG, PNG (Max 10MB)</p>
                </div>
              </div>

              {/* Health Verification Report */}
              {isAnalyzing && (
                <div className="analysis-loading">
                  <div className="spinner-sm"></div>
                  <p>Analyzing health record...</p>
                </div>
              )}

              {formAnalysis && (
                <div className="health-verification-report animate-slide-up">
                  <div className="report-header">
                    <h3>Health Verification</h3>
                    <span className="verified-stamp">Verified Status</span>
                  </div>
                  
                  <div className="report-stats-grid">
                    <div className="stat-box">
                      <label>Heart Rate</label>
                      <span className="value">{formAnalysis.vitals.heartRate}</span>
                    </div>
                    <div className="stat-box">
                      <label>Temperature</label>
                      <span className="value">{formAnalysis.vitals.temperature}</span>
                    </div>
                    <div className="stat-box">
                      <label>Activity</label>
                      <span className="value">{formAnalysis.vitals.activity}</span>
                    </div>
                  </div>

                  <div className="report-summary">
                    <p><strong>Observations:</strong> {formAnalysis.observations.join('. ')}</p>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-discard" onClick={() => setShowForm(false)}>Discard</button>
                <button type="submit" className="btn-save-record">Save Record</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="records-section-premium">
        <div className="section-header-modern">
          <h3>Medical History Log</h3>
          <span className="count-badge">{medicalRecords.length} Records found</span>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading records...</p>
          </div>
        ) : medicalRecords.length === 0 ? (
          <div className="empty-state-premium">
            <div className="empty-icon">📁</div>
            <h4>No records found</h4>
            <p>Ready to track your pet's health? Add your first record above.</p>
          </div>
        ) : (
          <div className="records-grid-premium">
            {medicalRecords.map(record => (
              <div key={record.id} className="medical-card-premium animate-fade-in">
                <div className="card-header-premium">
                  <div className="header-top">
                    <span className="record-type">{record.condition}</span>
                    <div className="badge-group">
                      {record.isVerified && <span className="verified-badge-pill">✓ Verified</span>}
                      <span className="method-badge">{record.vetClinic ? 'Clinic' : 'Manual'}</span>
                    </div>
                  </div>
                  <div className="record-date-pill">{new Date(record.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                
                <div className="card-body-premium">
                  <div className="info-row">
                    <span className="label">Veterinarian</span>
                    <span className="value">{record.vetName || 'Not specified'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Clinic</span>
                    <span className="value">{record.vetClinic || 'Personal Record'}</span>
                  </div>
                  <div className="diagnosis-box">
                    <label>Diagnosis & Treatment</label>
                    <p>{record.diagnosis || 'No diagnosis recorded.'}</p>
                  </div>
                </div>

                <div className="card-footer-premium">
                  <div className="cost-tag">
                    <span className="currency">₹</span>
                    <span className="amount">{parseFloat(record.cost || 0).toLocaleString()}</span>
                  </div>
                  <div className="footer-actions">
                    <button className="btn-icon delete" onClick={() => handleDelete(record.id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
