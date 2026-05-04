# Week 3-4: Developer's Quick Reference - Pet Health Tracking Module

**For Developers & Maintainers**  
**Last Updated:** February 25, 2026

---

## Quick Navigation

| Feature | Backend | Frontend | Database | Services |
|---------|---------|----------|----------|----------|
| **Pet Management** | petController.js | PetsList.jsx | Pet.js | petService.js |
| **Medical History** | medicalHistoryController.js | MedicalHistory.jsx | MedicalHistory.js | medicalHistoryService.js |
| **Vaccinations** | vaccinationController.js | VaccinationManagement.jsx | Vaccination.js | vaccinationService.js |
| **Health Reminders** | healthReminderController.js | HealthReminders.jsx | HealthReminder.js | healthReminderService.js |
| **Medicine Schedule** | medicineScheduleController.js | MedicineSchedule.jsx | MedicineSchedule.js | medicineScheduleService.js |
| **Health Metrics** | healthMetricsController.js | HealthDashboard.jsx | HealthMetrics.js | healthMetricsService.js |
| **Weight Tracking** | weightLossController.js | WeightLossTracking.jsx | WeightLoss.js | weightLossService.js |
| **Analytics** | analyticsController.js | AnalyticsDashboard.jsx | All models | analyticsService.js |
| **Notifications** | notificationController.js | Toast/Notifications | Notification.js | NotificationScheduler.js |

---

## API Endpoint Reference

### Pet Management
```javascript
GET    /api/pets
POST   /api/pets
GET    /api/pets/:petId
PUT    /api/pets/:petId
DELETE /api/pets/:petId
```

### Medical History
```javascript
GET    /api/pets/:petId/medical-history
POST   /api/pets/:petId/medical-history
PUT    /api/medical-history/:recordId
DELETE /api/medical-history/:recordId
```

### Vaccinations
```javascript
GET    /api/pets/:petId/vaccinations
POST   /api/pets/:petId/vaccinations
PUT    /api/vaccinations/:vaccinationId
DELETE /api/vaccinations/:vaccinationId
GET    /api/vaccinations/status/:petId
```

### Health Reminders
```javascript
GET    /api/pets/:petId/health-reminders
POST   /api/pets/:petId/health-reminders
PUT    /api/health-reminders/:reminderId
DELETE /api/health-reminders/:reminderId
GET    /api/reminders/upcoming/:petId
```

### Medicine Schedule
```javascript
GET    /api/pets/:petId/medicine-schedule
POST   /api/pets/:petId/medicine-schedule
PUT    /api/medicine-schedule/:scheduleId
DELETE /api/medicine-schedule/:scheduleId
GET    /api/medicine-schedule/active/:petId
```

### Health Metrics
```javascript
GET    /api/pets/:petId/health-metrics
POST   /api/pets/:petId/health-metrics
PUT    /api/health-metrics/:metricId
DELETE /api/health-metrics/:metricId
```

### Weight Tracking
```javascript
GET    /api/weight-loss/:petId
POST   /api/weight-loss
PUT    /api/weight-loss/:weightId
DELETE /api/weight-loss/:weightId
```

### Analytics
```javascript
GET    /api/pets/:petId/analytics/weight-trend?days=90
GET    /api/pets/:petId/analytics/temperature-trend?days=30
GET    /api/pets/:petId/analytics/vaccination-status
GET    /api/pets/:petId/analytics/medical-conditions
GET    /api/pets/:petId/analytics/dashboard
```

---

## Code Structure Overview

### Backend File Structure
```
backend/src/
├── controllers/
│   ├── petController.js (114 lines) - Pet CRUD operations
│   ├── medicalHistoryController.js - Medical record management
│   ├── vaccinationController.js - Vaccination operations
│   ├── medicineScheduleController.js - Medicine tracking
│   ├── healthReminderController.js - Reminder creation/updates
│   ├── healthMetricsController.js - Vital signs tracking
│   ├── weightLossController.js - Weight data storage
│   ├── analyticsController.js - Data aggregation/analysis
│   └── [other controllers]
│
├── models/
│   ├── Pet.js - User's pets data model
│   ├── MedicalHistory.js - Medical conditions model
│   ├── Vaccination.js - Vaccination records model
│   ├── MedicineSchedule.js - Medicine tracking model
│   ├── HealthReminder.js - Reminders model
│   ├── HealthMetrics.js - Vital signs model (heart rate, temp, etc)
│   ├── WeightLoss.js - Historical weight data
│   ├── Notification.js - Notification audit log
│   └── index.js - Model exports
│
├── routes/
│   ├── petRoutes.js
│   ├── medicalHistoryRoutes.js
│   ├── vaccinationRoutes.js
│   ├── medicineScheduleRoutes.js
│   ├── healthReminderRoutes.js
│   ├── healthMetricsRoutes.js
│   ├── weightLossRoutes.js
│   ├── analyticsRoutes.js
│   └── [other routes]
│
├── services/
│   └── NotificationScheduler.js (Cron jobs for reminders)
│
├── middleware/
│   └── authMiddleware.js (JWT validation)
│
├── config/
│   └── database.js (Sequelize config)
│
└── server.js (Express app entry point)
```

### Frontend File Structure
```
frontend/src/
├── components/
│   ├── PetsList.jsx (181 lines) - Pet management UI
│   ├── MedicalHistory.jsx - Medical records display
│   ├── VaccinationManagement.jsx - Vaccination UI
│   ├── MedicineSchedule.jsx - Medicine tracking UI
│   ├── HealthReminders.jsx - Reminders UI
│   ├── WeightLossTracking.jsx - Weight tracking UI
│   ├── HealthHistory.jsx - Unified health dashboard
│   ├── AnalyticsDashboard.jsx (358 lines) - Charts/analytics
│   ├── Dashboard.jsx - Main dashboard
│   └── [other components]
│
├── services/
│   ├── api.js - Axios instance with interceptors
│   ├── authService.js - Auth + pet service helpers
│   ├── medicalHistoryService.js
│   ├── vaccinationService.js
│   ├── medicineScheduleService.js
│   ├── healthReminderService.js
│   ├── weightLossService.js
│   ├── analyticsService.js
│   └── paymentService.js
│
├── styles/
│   ├── pets.css
│   ├── medical-history.css
│   ├── health-history.css
│   ├── analytics-dashboard.css
│   ├── health-reminders.css
│   └── [other stylesheets]
│
├── context/
│   └── [React context providers if any]
│
├── pages/
│   ├── Dashboard.jsx - Main dashboard page
│   ├── AuthPage.jsx - Login/register
│   └── [other pages]
│
├── App.jsx - Main app component
├── main.jsx - React entry point
└── vite.config.js - Build configuration
```

---

## Common Development Tasks

### Adding a New Health Metric

**Step 1: Create Database Model**
```javascript
// backend/src/models/NewMetric.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('NewMetric', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    petId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Pets', key: 'id' },
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      defaultValue: 'kg',
    },
    recordedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
};
```

**Step 2: Create Controller**
```javascript
// backend/src/controllers/newMetricController.js
const { NewMetric, Pet } = require('../models');

exports.addMetric = async (req, res) => {
  try {
    const { petId } = req.params;
    const { value, unit } = req.body;

    // Verify pet ownership
    const pet = await Pet.findOne({ where: { id: petId, userId: req.userId } });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    const metric = await NewMetric.create({
      petId,
      value,
      unit,
      recordedAt: new Date(),
    });

    res.status(201).json({ metric });
  } catch (error) {
    res.status(500).json({ message: 'Error adding metric', error: error.message });
  }
};
```

**Step 3: Create Routes**
```javascript
// backend/src/routes/newMetricRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const newMetricController = require('../controllers/newMetricController');

router.post('/pets/:petId/new-metric', authMiddleware, newMetricController.addMetric);
router.get('/pets/:petId/new-metric', authMiddleware, newMetricController.getMetrics);

module.exports = router;
```

**Step 4: Register Routes in server.js**
```javascript
const newMetricRoutes = require('./routes/newMetricRoutes');
app.use('/api', newMetricRoutes);
```

**Step 5: Create Frontend Component**
```jsx
// frontend/src/components/NewMetricTracker.jsx
import React, { useState } from 'react';
import api from '../services/api';

export const NewMetricTracker = ({ petId }) => {
  const [value, setValue] = useState('');

  const handleAddMetric = async () => {
    try {
      await api.post(`/pets/${petId}/new-metric`, { value, unit: 'unit' });
      setValue('');
      // Refresh data
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleAddMetric}>Add Metric</button>
    </div>
  );
};
```

---

## Database Schema Overview

### Pet Table
```sql
CREATE TABLE Pets (
  id UUID PRIMARY KEY,
  userId UUID FOREIGN KEY,
  name VARCHAR(255),
  type VARCHAR(50),
  breed VARCHAR(100),
  age INT,
  weight FLOAT,
  color VARCHAR(100),
  dateOfBirth DATE,
  medicalNotes TEXT,
  vaccinated BOOLEAN,
  neutered BOOLEAN,
  microchipId VARCHAR(100),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### MedicalHistory Table
```sql
CREATE TABLE MedicalHistories (
  id UUID PRIMARY KEY,
  petId UUID FOREIGN KEY,
  condition VARCHAR(255),
  description TEXT,
  diagnosisDate DATE,
  resolutionDate DATE,
  severity ENUM('mild', 'moderate', 'severe'),
  treatment TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Vaccination Table
```sql
CREATE TABLE Vaccinations (
  id UUID PRIMARY KEY,
  petId UUID FOREIGN KEY,
  vaccineName VARCHAR(255),
  vaccinationType VARCHAR(100),
  vaccinationDate DATE,
  dueDate DATE,
  validUntil DATE,
  veterinarian VARCHAR(255),
  status ENUM('scheduled', 'completed', 'overdue', 'pending'),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Similar patterns for other tables...

---

## Common Debugging Commands

### Backend Debugging
```bash
# Start with debug logging
DEBUG=* npm run dev

# Check specific port
netstat -ano | findstr :5000  # Windows
lsof -i :5000               # Mac/Linux

# View database
# SQLite: Open database.sqlite with SQLite viewer

# Check logs
tail -f logs/app.log
```

### Frontend Debugging
```bash
# Browser DevTools
# Press F12 or Ctrl+Shift+I

# Check Network tab
# Check Console for errors
# Check Application > Local Storage for tokens

# Clear cache and reload
# Ctrl+Shift+Delete
```

### Common Error Solutions

#### "Cannot GET /api/pets"
- Check backend running on port 5000
- Verify route mounted in server.js
- Check route file exists

#### "401 Unauthorized"
- Check JWT token in localStorage
- Verify authMiddleware.js is correct
- Check token not expired

#### "CORS Error"
- Verify backend has CORS enabled
- Check frontend URL in CORS config
- Check Axios baseURL correct

#### "Database locked"
- Close duplicate connections
- Restart backend: `npm run dev`

---

## Performance Optimization Tips

### Frontend Optimization
1. Use React.memo for chart components
2. Implement lazy loading for heavy charts
3. Paginate long lists (medical history, etc)
4. Debounce search inputs
5. Cache API responses when possible

### Backend Optimization
1. Index frequently queried fields (petId, userId)
2. Limit analytics queries with date range
3. Implement pagination for list endpoints
4. Use database queries efficiently
5. Cache calculated values (vaccine status)

### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_pet_userId ON Pets(userId);
CREATE INDEX idx_medical_petId ON MedicalHistories(petId);
CREATE INDEX idx_vaccination_petId ON Vaccinations(petId);
```

---

## Testing Endpoints with cURL

### Create Pet
```bash
curl -X POST http://localhost:5000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Max",
    "type": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "weight": 30
  }'
```

### Add Medical Record
```bash
curl -X POST http://localhost:5000/api/pets/PET_ID/medical-history \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "condition": "Hip Dysplasia",
    "description": "Hereditary condition",
    "severity": "moderate"
  }'
```

### Get Analytics
```bash
curl -X GET "http://localhost:5000/api/pets/PET_ID/analytics/weight-trend?days=90" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Deployment Checklist

- [ ] Environment variables configured (.env)
- [ ] Database backed up
- [ ] Frontend built (npm run build)
- [ ] Backend dependencies updated
- [ ] Error boundaries added
- [ ] Logging configured
- [ ] Security headers set
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Database migrations run
- [ ] Cron jobs verified
- [ ] Email service configured (if needed)

---

## Future Enhancement Ideas

### Short Term (1-2 weeks)
- [ ] Photo upload for pets
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Export data as CSV

### Medium Term (1-2 months)
- [ ] Veterinarian clinic directory integration
- [ ] SMS reminders
- [ ] Mobile app (React Native)
- [ ] Telemedicine appointments

### Long Term (3+ months)
- [ ] AI health insights
- [ ] Pet insurance integration
- [ ] Microchip registry integration
- [ ] Multi-language support
- [ ] Pet social network features

---

## Useful Resources

### Documentation
- [Sequelize ORM Docs](https://sequelize.org/)
- [Express.js Guide](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Recharts Documentation](https://recharts.org/)
- [Axios Documentation](https://axios-http.com/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [VS Code](https://code.visualstudio.com/) - Development
- [DB Browser SQLite](https://sqlitebrowser.org/) - Database viewer
- [DevTools](https://developer.chrome.com/docs/devtools/) - Browser debugging

---

## Contact & Support

For issues or questions:
1. Check TROUBLESHOOTING.md first
2. Review relevant documentation
3. Check console for error messages
4. Search codebase for similar implementations
5. Create detailed bug report with:
   - Steps to reproduce
   - Expected vs actual results
   - Browser/OS info
   - Console errors
   - Network requests (if applicable)

---

**Last Updated:** February 25, 2026  
**Version:** 1.0  
**Maintained By:** Development Team
