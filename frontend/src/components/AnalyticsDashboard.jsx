import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import api from '../services/api';
import '../styles/analytics-dashboard.css';

const AnalyticsDashboard = ({ petId }) => {
  const [weightData, setWeightData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [vaccineStatus, setVaccineStatus] = useState(null);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(90);

  useEffect(() => {
    if (petId) {
      fetchAnalyticsData();
    }
  }, [petId, selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');

      const [weightResponse, tempResponse, vaccineResponse, conditionsResponse, summaryResponse] =
        await Promise.all([
          api.get(`/pets/${petId}/analytics/weight-trend?days=${selectedPeriod}`),
          api.get(`/pets/${petId}/analytics/temperature-trend?days=${selectedPeriod}`),
          api.get(`/pets/${petId}/analytics/vaccination-status`),
          api.get(`/pets/${petId}/analytics/medical-conditions`),
          api.get(`/pets/${petId}/analytics/dashboard`),
        ]);

      // Format weight data
      if (weightResponse.data.data) {
        setWeightData(weightResponse.data.data);
      }

      // Format temperature data
      if (tempResponse.data.data) {
        setTempData(tempResponse.data.data);
      }

      // Format vaccine status
      if (vaccineResponse.data.vaccinationStatus) {
        setVaccineStatus(vaccineResponse.data.vaccinationStatus);
      }

      // Format medical conditions
      if (conditionsResponse.data.conditions) {
        setMedicalConditions(conditionsResponse.data.conditions);
      }

      // Set dashboard summary
      if (summaryResponse.data) {
        setDashboardSummary(summaryResponse.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error">
        <p>{error}</p>
        <button onClick={fetchAnalyticsData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Pet Health Analytics</h2>
        {dashboardSummary?.pet && (
          <div className="pet-info">
            <h3>{dashboardSummary.pet.name}</h3>
            <span className="pet-type">{dashboardSummary.pet.type} - {dashboardSummary.pet.breed}</span>
          </div>
        )}
      </div>

      {/* Period Selector */}
      <div className="period-selector">
        <label>Time Period:</label>
        <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}>
          <option value={30}>Last 30 Days</option>
          <option value={60}>Last 60 Days</option>
          <option value={90}>Last 90 Days</option>
          <option value={180}>Last 6 Months</option>
          <option value={365}>Last Year</option>
        </select>
      </div>

      {/* Health Summary Cards */}
      {dashboardSummary && (
        <div className="health-summary-cards">
          <div className="summary-card">
            <h4>Current Weight</h4>
            <p className="stat-value">{dashboardSummary.latestMetrics?.weight}kg</p>
            <span className="stat-label">Latest Recording</span>
          </div>

          <div className="summary-card">
            <h4>Temperature</h4>
            <p className="stat-value">{dashboardSummary.latestMetrics?.temperature}°C</p>
            <span className="stat-label">
              {dashboardSummary.latestMetrics?.temperature >= 37.5 &&
              dashboardSummary.latestMetrics?.temperature <= 39.2
                ? 'Normal Range'
                : 'Abnormal'}
            </span>
          </div>

          <div className="summary-card">
            <h4>Upcoming Appointments</h4>
            <p className="stat-value">{dashboardSummary.upcomingAppointments?.length || 0}</p>
            <span className="stat-label">Next 30 Days</span>
          </div>

          <div className="summary-card alert">
            <h4>Overdue Vaccines</h4>
            <p className="stat-value">{dashboardSummary.overdueVaccinations?.length || 0}</p>
            <span className="stat-label">Action Required</span>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Weight Trend Line Chart */}
        <div className="chart-container large">
          <h3>Weight Growth Trend</h3>
          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}
                  formatter={(value) => `${value}kg`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8b5cf6"
                  name="Weight"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <p>No weight data available</p>
            </div>
          )}
        </div>

        {/* Vaccination Status Radar Chart */}
        <div className="chart-container">
          <h3>Vaccination Status</h3>
          {vaccineStatus ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart
                data={[
                  {
                    name: 'Completed',
                    value: vaccineStatus.completed,
                    fullMark: vaccineStatus.total,
                  },
                  {
                    name: 'Pending',
                    value: vaccineStatus.pending,
                    fullMark: vaccineStatus.total,
                  },
                  {
                    name: 'Overdue',
                    value: vaccineStatus.overdue,
                    fullMark: vaccineStatus.total,
                  },
                ]}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar
                  name="Count"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <p>No vaccine data available</p>
            </div>
          )}
          {vaccineStatus && (
            <div className="vaccine-stats">
              <div className="vaccine-stat completed">
                <strong>{vaccineStatus.completed}</strong>
                <span>Completed</span>
              </div>
              <div className="vaccine-stat pending">
                <strong>{vaccineStatus.pending}</strong>
                <span>Pending</span>
              </div>
              <div className="vaccine-stat overdue">
                <strong>{vaccineStatus.overdue}</strong>
                <span>Overdue</span>
              </div>
            </div>
          )}
        </div>

        {/* Temperature Trend */}
        <div className="chart-container large">
          <h3>Temperature Monitoring</h3>
          {tempData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}
                  formatter={(value) => `${value}°C`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ef4444"
                  name="Temperature"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <p>No temperature data available</p>
            </div>
          )}
        </div>

        {/* Medical Conditions */}
        <div className="chart-container">
          <h3>Medical Conditions History</h3>
          {medicalConditions.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={medicalConditions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Occurrences" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <p>No medical history</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Medical History */}
      {dashboardSummary?.recentMedicalHistory?.length > 0 && (
        <div className="medical-history-section">
          <h3>Recent Medical History</h3>
          <div className="history-list">
            {dashboardSummary.recentMedicalHistory.map((record, index) => (
              <div key={index} className="history-item">
                <div className="history-date">{new Date(record.visitDate).toLocaleDateString()}</div>
                <div className="history-content">
                  <h5>{record.condition}</h5>
                  <p>{record.notes}</p>
                </div>
                <div className="history-status">{record.status || 'Completed'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      {dashboardSummary?.upcomingAppointments?.length > 0 && (
        <div className="upcoming-section">
          <h3>Upcoming Appointments</h3>
          <div className="appointments-list">
            {dashboardSummary.upcomingAppointments.map((apt, index) => (
              <div key={index} className="appointment-item">
                <div className="apt-date">{new Date(apt.appointmentDate).toLocaleDateString()}</div>
                <div className="apt-time">{new Date(apt.appointmentDate).toLocaleTimeString()}</div>
                <div className="apt-veterinarian">{apt.veterinarian}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
