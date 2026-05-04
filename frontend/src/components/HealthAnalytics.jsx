import React, { useState, useEffect } from 'react';
import { healthMetricsService, petService, vaccinationService } from '../services/authService';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import '../styles/health-analytics.css';

const HealthAnalytics = ({ petId }) => {
  const [pet, setPet] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalyticsData();
  }, [petId]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [petRes, metricsRes, vaccRes] = await Promise.all([
        petService.getPetById(petId),
        healthMetricsService.getHealthMetrics(petId),
        vaccinationService.getVaccinations(petId),
      ]);

      setPet(petRes.data.pet);
      setHealthMetrics(metricsRes.data?.metrics || []);
      setVaccinations(vaccRes.data?.vaccinations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMetrics = () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));

    return healthMetrics
      .filter(m => new Date(m.recordDate) >= cutoffDate)
      .map(m => ({
        ...m,
        date: new Date(m.recordDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        timestamp: new Date(m.recordDate).getTime(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const getWeightTrend = () => {
    const filtered = getFilteredMetrics();
    if (filtered.length === 0) return null;

    const data = filtered.filter(m => m.weight).map(m => ({
      date: m.date,
      weight: parseFloat(m.weight),
    }));

    return data.length > 0 ? data : null;
  };

  const getTemperatureTrend = () => {
    const filtered = getFilteredMetrics();
    if (filtered.length === 0) return null;

    const data = filtered.filter(m => m.temperature).map(m => ({
      date: m.date,
      temperature: parseFloat(m.temperature),
    }));

    return data.length > 0 ? data : null;
  };

  const getHealthDistribution = () => {
    if (healthMetrics.length === 0) return [];

    let normal = 0, warning = 0, critical = 0;

    healthMetrics.forEach(m => {
      let score = 0;
      if (m.temperature && (m.temperature < 37.5 || m.temperature > 39)) score++;
      if (m.heartRate && (m.heartRate < 60 || m.heartRate > 100)) score++;
      if (m.hydration === 'dehydrated') score++;

      if (score === 0) normal++;
      else if (score === 1) warning++;
      else critical++;
    });

    return [
      { name: 'Healthy', value: normal, color: '#4CAF50' },
      { name: 'Warning', value: warning, color: '#ff9800' },
      { name: 'Critical', value: critical, color: '#f44336' },
    ].filter(d => d.value > 0);
  };

  const getVaccinationStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let upcoming = 0, overdue = 0, upToDate = 0;

    vaccinations.forEach(v => {
      const dueDate = new Date(v.nextDueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        overdue++;
      } else if (dueDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
        upcoming++;
      } else {
        upToDate++;
      }
    });

    return [
      { name: 'Up to Date', value: upToDate, color: '#4CAF50' },
      { name: 'Due Soon', value: upcoming, color: '#ff9800' },
      { name: 'Overdue', value: overdue, color: '#f44336' },
    ].filter(d => d.value > 0);
  };

  const getStatistics = () => {
    if (healthMetrics.length === 0) return {};

    const weights = healthMetrics.filter(m => m.weight).map(m => parseFloat(m.weight));
    const temperatures = healthMetrics.filter(m => m.temperature).map(m => parseFloat(m.temperature));
    const heartRates = healthMetrics.filter(m => m.heartRate).map(m => parseFloat(m.heartRate));

    const stats = {};

    if (weights.length > 0) {
      stats.weight = {
        current: weights[weights.length - 1],
        min: Math.min(...weights),
        max: Math.max(...weights),
        avg: (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1),
      };
    }

    if (temperatures.length > 0) {
      stats.temperature = {
        current: temperatures[temperatures.length - 1],
        min: Math.min(...temperatures),
        max: Math.max(...temperatures),
        avg: (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1),
      };
    }

    if (heartRates.length > 0) {
      stats.heartRate = {
        current: heartRates[heartRates.length - 1],
        min: Math.min(...heartRates),
        max: Math.max(...heartRates),
        avg: (heartRates.reduce((a, b) => a + b, 0) / heartRates.length).toFixed(1),
      };
    }

    return stats;
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  const weightData = getWeightTrend();
  const tempData = getTemperatureTrend();
  const healthDist = getHealthDistribution();
  const vaccStatus = getVaccinationStatus();
  const stats = getStatistics();

  return (
    <div className="health-analytics">
      <div className="analytics-header">
        <h2>Health Analytics - {pet?.name}</h2>
        <div className="filters">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      {Object.keys(stats).length > 0 && (
        <div className="stats-grid">
          {stats.weight && (
            <div className="stat-card">
              <h3>Weight</h3>
              <div className="stat-value">{stats.weight.current} kg</div>
              <div className="stat-details">
                <span>Min: {stats.weight.min} kg</span>
                <span>Max: {stats.weight.max} kg</span>
                <span>Avg: {stats.weight.avg} kg</span>
              </div>
            </div>
          )}

          {stats.temperature && (
            <div className="stat-card">
              <h3>Temperature</h3>
              <div className="stat-value">{stats.temperature.current}°C</div>
              <div className="stat-details">
                <span>Min: {stats.temperature.min}°C</span>
                <span>Max: {stats.temperature.max}°C</span>
                <span>Avg: {stats.temperature.avg}°C</span>
              </div>
            </div>
          )}

          {stats.heartRate && (
            <div className="stat-card">
              <h3>Heart Rate</h3>
              <div className="stat-value">{stats.heartRate.current} bpm</div>
              <div className="stat-details">
                <span>Min: {stats.heartRate.min} bpm</span>
                <span>Max: {stats.heartRate.max} bpm</span>
                <span>Avg: {stats.heartRate.avg} bpm</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="charts-grid">
        {weightData && (
          <div className="chart-card">
            <h3>Weight Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="weight" stroke="#667eea" fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {tempData && (
          <div className="chart-card">
            <h3>Temperature Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#ff9800" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Health Distribution Pie Chart */}
      {healthDist.length > 0 && (
        <div className="chart-card full-width">
          <h3>Health Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={healthDist}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {healthDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Vaccination Status */}
      {vaccStatus.length > 0 && (
        <div className="chart-card full-width">
          <h3>Vaccination Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vaccStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#667eea">
                {vaccStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary */}
      <div className="summary-section">
        <h3>Summary</h3>
        <div className="summary-content">
          <div className="summary-item">
            <span className="label">Total Health Records:</span>
            <span className="value">{healthMetrics.length}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Vaccinations:</span>
            <span className="value">{vaccinations.length}</span>
          </div>
          <div className="summary-item">
            <span className="label">Last Updated:</span>
            <span className="value">
              {healthMetrics.length > 0
                ? new Date(healthMetrics[healthMetrics.length - 1].recordDate).toLocaleDateString()
                : 'No data'}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default HealthAnalytics;
