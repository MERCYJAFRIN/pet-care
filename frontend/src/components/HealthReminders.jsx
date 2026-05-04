import React, { useState, useEffect } from 'react';
import { healthReminderService, petService } from '../services/authService';
import '../styles/health-reminders.css';

const HealthReminders = () => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [reminders, setReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [overdueReminders, setOverdueReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    reminderType: 'checkup',
    title: '',
    description: '',
    reminderDate: '',
    frequency: 'once',
    notes: '',
  });

  const reminderTypes = [
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'checkup', label: 'Check-up' },
    { value: 'appointment', label: 'Appointment' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'weight_check', label: 'Weight Check' },
    { value: 'dental', label: 'Dental' },
    { value: 'custom', label: 'Custom' },
  ];

  const frequencies = [
    { value: 'once', label: 'One Time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      fetchReminders(selectedPetId);
      fetchUpcomingReminders(selectedPetId);
      fetchOverdueReminders(selectedPetId);
    }
  }, [selectedPetId]);

  const fetchPets = async () => {
    try {
      const response = await petService.getPets();
      setPets(response.data.pets);
      if (response.data.pets.length > 0) {
        setSelectedPetId(response.data.pets[0].id);
      }
    } catch (err) {
      setError('Failed to fetch pets');
    }
  };

  const fetchReminders = async (petId) => {
    try {
      setLoading(true);
      const response = await healthReminderService.getHealthReminders(petId);
      setReminders(response.data.reminders || []);
    } catch (err) {
      setError('Failed to fetch reminders');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingReminders = async (petId) => {
    try {
      const response = await healthReminderService.getUpcomingReminders(petId);
      setUpcomingReminders(response.data.reminders || []);
    } catch (err) {
      console.error('Failed to fetch upcoming reminders');
    }
  };

  const fetchOverdueReminders = async (petId) => {
    try {
      const response = await healthReminderService.getOverdueReminders(petId);
      setOverdueReminders(response.data.reminders || []);
    } catch (err) {
      console.error('Failed to fetch overdue reminders');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await healthReminderService.updateHealthReminder(selectedPetId, editingId, formData);
        setEditingId(null);
      } else {
        await healthReminderService.createHealthReminder(selectedPetId, formData);
      }
      resetForm();
      fetchReminders(selectedPetId);
      fetchUpcomingReminders(selectedPetId);
      fetchOverdueReminders(selectedPetId);
    } catch (err) {
      setError('Failed to save reminder');
    }
  };

  const resetForm = () => {
    setFormData({
      reminderType: 'checkup',
      title: '',
      description: '',
      reminderDate: '',
      frequency: 'once',
      notes: '',
    });
    setShowForm(false);
  };

  const handleDelete = async (reminderId) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await healthReminderService.deleteHealthReminder(selectedPetId, reminderId);
        fetchReminders(selectedPetId);
        fetchUpcomingReminders(selectedPetId);
        fetchOverdueReminders(selectedPetId);
      } catch (err) {
        setError('Failed to delete reminder');
      }
    }
  };

  const handleEdit = (reminder) => {
    setFormData({
      reminderType: reminder.reminderType,
      title: reminder.title,
      description: reminder.description || '',
      reminderDate: reminder.reminderDate.split('T')[0],
      frequency: reminder.frequency,
      notes: reminder.notes || '',
    });
    setEditingId(reminder.id);
    setShowForm(true);
  };

  const handleMarkComplete = async (reminderId) => {
    try {
      await healthReminderService.markReminderCompleted(selectedPetId, reminderId);
      fetchReminders(selectedPetId);
      fetchUpcomingReminders(selectedPetId);
      fetchOverdueReminders(selectedPetId);
    } catch (err) {
      setError('Failed to mark reminder complete');
    }
  };

  return (
    <div className="health-reminders-container">
      <h2>Health Reminders</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="pet-selector">
        <label htmlFor="pet-select">Select Pet:</label>
        <select
          id="pet-select"
          value={selectedPetId}
          onChange={(e) => setSelectedPetId(e.target.value)}
        >
          {pets.map(pet => (
            <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
          ))}
        </select>
      </div>

      {overdueReminders.length > 0 && (
        <div className="alerts-panel overdue">
          <h3>Overdue Reminders ({overdueReminders.length})</h3>
          <div className="reminders-list">
            {overdueReminders.map(reminder => (
              <div key={reminder.id} className="reminder-alert overdue">
                <div className="reminder-info">
                  <h4>{reminder.title}</h4>
                  <p className="due-date">Due: {new Date(reminder.reminderDate).toLocaleDateString()}</p>
                </div>
                <button
                  className="btn-complete"
                  onClick={() => handleMarkComplete(reminder.id)}
                >
                  Mark Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingReminders.length > 0 && (
        <div className="alerts-panel upcoming">
          <h3>Upcoming Reminders (Next 7 Days) ({upcomingReminders.length})</h3>
          <div className="reminders-list">
            {upcomingReminders.map(reminder => (
              <div key={reminder.id} className="reminder-alert upcoming">
                <div className="reminder-info">
                  <h4>{reminder.title}</h4>
                  <p className="due-date">Due: {new Date(reminder.reminderDate).toLocaleDateString()}</p>
                </div>
                <button
                  className="btn-complete"
                  onClick={() => handleMarkComplete(reminder.id)}
                >
                  Mark Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          resetForm();
        }}
      >
        {showForm ? 'Cancel' : '+ Add Reminder'}
      </button>

      {showForm && (
        <form className="reminder-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Reminder Type *</label>
              <select
                name="reminderType"
                value={formData.reminderType}
                onChange={handleChange}
                required
              >
                {reminderTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Reminder title"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Reminder details"
              rows="2"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Reminder Date *</label>
              <input
                type="date"
                name="reminderDate"
                value={formData.reminderDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Frequency *</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
              >
                {frequencies.map(freq => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes"
              rows="2"
            />
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? 'Update Reminder' : 'Add Reminder'}
          </button>
        </form>
      )}

      <div className="reminders-list-full">
        <h3>All Reminders</h3>
        {loading ? (
          <p>Loading...</p>
        ) : reminders.length === 0 ? (
          <p>No reminders set for this pet.</p>
        ) : (
          <div className="reminders-grid">
            {reminders.map(reminder => (
              <div key={reminder.id} className="reminder-card">
                <div className="card-header">
                  <h4>{reminder.title}</h4>
                  <span className={`type-badge ${reminder.reminderType}`}>{reminder.reminderType}</span>
                </div>
                <div className="card-body">
                  {reminder.description && <p>{reminder.description}</p>}
                  <p><strong>Date:</strong> {new Date(reminder.reminderDate).toLocaleDateString()}</p>
                  <p><strong>Frequency:</strong> {reminder.frequency}</p>
                  {reminder.notes && <p><strong>Notes:</strong> {reminder.notes}</p>}
                  <p><strong>Status:</strong> {reminder.completed ? 'Completed' : 'Pending'}</p>
                </div>
                <div className="card-actions">
                  {!reminder.completed && (
                    <button
                      className="btn-complete"
                      onClick={() => handleMarkComplete(reminder.id)}
                    >
                      Complete
                    </button>
                  )}
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(reminder)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(reminder.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthReminders;
