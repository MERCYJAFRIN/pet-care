# Health Metrics Service - Developer Quick Reference

## 🚀 Quick Start

### Import the Service
```javascript
import { healthMetricsService } from '../services/authService';
```

### Use in Component
```jsx
const MyComponent = ({ petId }) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch metrics
  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await healthMetricsService.getHealthMetrics(petId);
      setMetrics(response.data.metrics || []);
    } catch (err) {
      setError('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (petId) loadMetrics();
  }, [petId]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {metrics.map(metric => (
        <div key={metric.id}>{metric.weight} kg</div>
      ))}
    </div>
  );
};
```

---

## 📋 API Methods Reference

### Create Health Metric
```javascript
const response = await healthMetricsService.createHealthMetric(petId, {
  weight: 30.5,                    // kg
  temperature: 38.5,               // Celsius
  heartRate: 85,                   // bpm
  bloodPressure: '120/80',         // systolic/diastolic
  respiratoryRate: 30,             // breaths/min
  hydration: 'normal',             // 'normal', 'dehydrated', etc.
  appetite: 'good',                // 'good', 'poor', 'normal', etc.
  activityLevel: 'active',         // 'active', 'inactive', 'normal'
  notes: 'Regular checkup',        // optional
});

// Response
console.log(response.data.metric);  // Created metric object
```

### Get All Metrics for Pet
```javascript
const response = await healthMetricsService.getHealthMetrics(petId);

// Response
console.log(response.data.metrics);  // Array of metric objects
```

### Get Latest Metric
```javascript
const response = await healthMetricsService.getLatestHealthMetric(petId);

// Response
console.log(response.data.metric);   // Latest metric object or null
```

### Get Metrics by Date Range
```javascript
const response = await healthMetricsService.getHealthMetricsDateRange(
  petId,
  '2024-01-01',  // Start date (YYYY-MM-DD)
  '2024-12-31'   // End date (YYYY-MM-DD)
);

// Response
console.log(response.data.metrics);  // Array of metrics in date range
```

### Get Specific Metric
```javascript
const response = await healthMetricsService.getHealthMetricById(petId, metricId);

// Response
console.log(response.data.metric);   // Specific metric object
```

### Update Metric
```javascript
const response = await healthMetricsService.updateHealthMetric(
  petId,
  metricId,
  {
    weight: 31.0,                // Can update any field
    temperature: 38.2,
    // ... other fields to update
  }
);

// Response
console.log(response.data.metric);   // Updated metric object
```

### Delete Metric
```javascript
const response = await healthMetricsService.deleteHealthMetric(petId, metricId);

// Response
console.log(response.data.message);  // Confirmation message
```

---

## 💡 Common Patterns

### Pattern 1: Load and Display Metrics
```jsx
const HealthMetricsDisplay = ({ petId }) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await healthMetricsService.getHealthMetrics(petId);
        setMetrics(res.data.metrics || []);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [petId]);

  return (
    <div>
      {loading ? (
        <p>Loading metrics...</p>
      ) : metrics.length === 0 ? (
        <p>No metrics recorded yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Weight</th>
              <th>Temperature</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map(m => (
              <tr key={m.id}>
                <td>{m.weight} kg</td>
                <td>{m.temperature}°C</td>
                <td>{new Date(m.recordedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
```

### Pattern 2: Add New Metric Form
```jsx
const AddMetricForm = ({ petId, onSuccess }) => {
  const [formData, setFormData] = useState({
    weight: '',
    temperature: '',
    heartRate: '',
    appetite: 'normal',
    activityLevel: 'active',
    hydration: 'normal',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await healthMetricsService.createHealthMetric(petId, {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
      });

      setFormData({
        weight: '',
        temperature: '',
        heartRate: '',
        appetite: 'normal',
        activityLevel: 'active',
        hydration: 'normal',
        notes: '',
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save metric');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        step="0.1"
        value={formData.weight}
        onChange={handleChange}
      />

      <input
        type="number"
        name="temperature"
        placeholder="Temperature (°C)"
        step="0.1"
        value={formData.temperature}
        onChange={handleChange}
      />

      <input
        type="number"
        name="heartRate"
        placeholder="Heart Rate (bpm)"
        value={formData.heartRate}
        onChange={handleChange}
      />

      <select name="appetite" value={formData.appetite} onChange={handleChange}>
        <option value="poor">Poor Appetite</option>
        <option value="normal">Normal Appetite</option>
        <option value="good">Good Appetite</option>
      </select>

      <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
        <option value="inactive">Inactive</option>
        <option value="normal">Normal</option>
        <option value="active">Active</option>
      </select>

      <textarea
        name="notes"
        placeholder="Additional notes"
        value={formData.notes}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Metric'}
      </button>
    </form>
  );
};
```

### Pattern 3: Get Latest Metric with Fallback
```jsx
const LatestMetricDisplay = ({ petId }) => {
  const [metric, setMetric] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatest = async () => {
      try {
        const res = await healthMetricsService.getLatestHealthMetric(petId);
        setMetric(res.data.metric);
      } catch (err) {
        console.warn('No metrics found:', err.message);
        setMetric(null);
      } finally {
        setLoading(false);
      }
    };

    loadLatest();
  }, [petId]);

  if (loading) return <p>Loading...</p>;

  return metric ? (
    <div className="metric-card">
      <h3>Latest Health Check</h3>
      {metric.weight && <p>Weight: {metric.weight} kg</p>}
      {metric.temperature && <p>Temperature: {metric.temperature}°C</p>}
      {metric.heartRate && <p>Heart Rate: {metric.heartRate} bpm</p>}
      <p className="date">{new Date(metric.recordedDate).toLocaleDateString()}</p>
    </div>
  ) : (
    <p>No health metrics recorded yet. Add one to get started!</p>
  );
};
```

### Pattern 4: Metrics History with Chart
```jsx
const MetricsChart = ({ petId }) => {
  const [metricsData, setMetricsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const res = await healthMetricsService.getHealthMetricsDateRange(
        petId,
        startDate,
        endDate
      );
      setMetricsData(res.data.metrics || []);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [petId, startDate, endDate]);

  return (
    <div>
      <div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : metricsData.length === 0 ? (
        <p>No data in selected range</p>
      ) : (
        <div>
          {/* Render chart here using data */}
          <p>Found {metricsData.length} metrics</p>
          {/* Example: Could integrate with Chart.js, Recharts, etc. */}
        </div>
      )}
    </div>
  );
};
```

---

## ⚠️ Error Handling

### Common Errors

```javascript
try {
  await healthMetricsService.createHealthMetric(petId, data);
} catch (err) {
  // err.response?.status code
  if (err.response?.status === 401) {
    // User not authenticated
    console.log('Please login again');
  } else if (err.response?.status === 404) {
    // Pet not found
    console.log('Pet not found');
  } else if (err.response?.status === 400) {
    // Invalid data
    console.log('Invalid metric data:', err.response.data.message);
  } else {
    // Server error
    console.log('Server error:', err.message);
  }
}
```

### Graceful Degradation Pattern
```javascript
const getMetricsWithFallback = async (petId) => {
  try {
    const res = await healthMetricsService.getHealthMetrics(petId);
    return res.data.metrics || [];
  } catch (err) {
    console.warn('Could not fetch metrics:', err.message);
    return [];  // Return empty array instead of failing
  }
};
```

---

## 📊 Data Validation

Before sending to API:
```javascript
const validMetricData = {
  weight: weight ? parseFloat(weight) : null,      // Must be number
  temperature: temp ? parseFloat(temp) : null,     // Must be number
  heartRate: hr ? parseInt(hr, 10) : null,         // Must be integer
  bloodPressure: bp || null,                       // String format: "120/80"
  respiratoryRate: rr ? parseInt(rr, 10) : null,   // Must be integer
  hydration: hydration || 'normal',                // Must be string
  appetite: appetite || 'normal',                  // Must be string
  activityLevel: level || 'active',                // Must be string
  notes: notes || null,                            // Optional string
};
```

---

## 🔗 Related Services

Other related services to use together:

- **petService**: Fetch pets with health data
- **analyticsService**: Get health trend analytics
- **healthReminderService**: Set up health reminders
- **vaccinationService**: Track vaccinations
- **medicalHistoryService**: Keep medical records

---

## 🎯 Best Practices

1. **Always handle errors gracefully** - Don't let metrics fetch block UI
2. **Use loading states** - Provide feedback while fetching data
3. **Validate data before sending** - Ensure proper data types
4. **Cache metrics data** - Avoid unnecessary API calls
5. **Log errors to console** - Helps with debugging
6. **Use parallel requests** - Fetch metrics for multiple pets at once
7. **Handle missing data** - Not all metric fields are required

---

## 📚 Examples Repository

Check the component examples in:
- `frontend/src/components/HealthDashboard.jsx`
- `frontend/src/components/PetsList.jsx`
- `frontend/src/components/MedicalHistory.jsx`

---

**Last Updated**: February 27, 2026
**Status**: Ready for Production
