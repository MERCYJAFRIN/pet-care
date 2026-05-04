import React, { useState } from 'react';
import '../styles/prescription-modal.css';
import axiosInstance from '../services/api';

const WritePrescriptionModal = ({ appointment, onClose }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([
    { name: '', dosage: '', schedule: { morning: false, noon: false, night: false } }
  ]);
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', schedule: { morning: false, noon: false, night: false } }]);
  };

  const handleRemoveMedication = (index) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    if (field.startsWith('schedule.')) {
      const time = field.split('.')[1];
      updated[index].schedule[time] = value;
    } else {
      updated[index][field] = value;
    }
    setMedications(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Structure the data according to backend needs
      const payload = {
        diagnosis,
        medications: JSON.stringify(medications),
        duration,
        instructions
      };

      // In a real app we'd submit to the actual endpoint
      console.log('Prescription Save payload:', payload);

      // Simulate API Call complete
      setTimeout(() => {
        alert('Prescription saved successfully');
        onClose();
        setSaving(false);
      }, 500);

    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save prescription');
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay prescription-modal-overlay">
      <div className="prescription-modal card pop-in">
        <div className="modal-header">
          <h2 className="prescription-h2">📑 Write Prescription</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body-scroll">
          <div className="form-group">
            <label>Diagnosis *</label>
            <input 
              type="text" 
              placeholder="e.g. Skin infection" 
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Medications *</label>
            {medications.map((med, index) => (
              <div key={index} className="medication-block pop-in">
                <div className="med-header">
                  <span>Medicine #{index + 1}</span>
                  <button className="btn-remove-med pop" onClick={() => handleRemoveMedication(index)}>🗑️</button>
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. Amoxicillin" 
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  className="med-name-input"
                />
                
                <div className="dosage-row">
                  <div className="dosage-inputbox">
                    <label>Dosage amount (e.g. 500mg)</label>
                    <input 
                      type="text" 
                      placeholder="Dosage..." 
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    />
                  </div>
                  <div className="schedule-checkboxes">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={med.schedule.morning}
                        onChange={(e) => handleMedicationChange(index, 'schedule.morning', e.target.checked)}
                      /> Morning
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={med.schedule.noon}
                        onChange={(e) => handleMedicationChange(index, 'schedule.noon', e.target.checked)}
                      /> Noon
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={med.schedule.night}
                        onChange={(e) => handleMedicationChange(index, 'schedule.night', e.target.checked)}
                      /> Night
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button className="btn-add-med pop" onClick={handleAddMedication}>+ Add Medication</button>
          </div>

          <div className="form-row-split pop-in">
             <div className="form-group">
               <label>Total Duration</label>
               <input 
                 type="text" 
                 placeholder="e.g. 5 days" 
                 value={duration}
                 onChange={(e) => setDuration(e.target.value)}
               />
             </div>
             <div className="form-group">
               <label>Attach Prescription Image <br/><span style={{fontSize: '0.8rem', fontWeight: 400}}>(Optional)</span></label>
               <input 
                 type="file" 
                 accept="image/*,.pdf" 
                 onChange={(e) => setFile(e.target.files[0])}
                 className="file-input"
               />
             </div>
          </div>

          <div className="form-group pop-in">
            <label>Instructions / Additional Notes</label>
            <textarea 
              rows="4" 
              placeholder="e.g. Give with food"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
           <button className="btn-cancel pop" onClick={onClose} disabled={saving}>Cancel</button>
           <button className="btn-save pop" onClick={handleSave} disabled={saving}>
             {saving ? 'Saving...' : 'Save Prescription'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default WritePrescriptionModal;
