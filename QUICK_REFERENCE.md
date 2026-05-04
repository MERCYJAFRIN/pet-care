# Pet Care Application - Quick Reference Guide

## Project Structure Quick Reference

```
Pet Care/
├── backend/
│   ├── src/
│   │   ├── server.js              # Main server file
│   │   ├── config/
│   │   │   └── database.js        # Database configuration
│   │   ├── controllers/           # Business logic (6 new + 2 original)
│   │   ├── models/                # Database models (6 new + 4 original)
│   │   ├── routes/                # API routes (6 new + 2 original)
│   │   └── middleware/
│   │       └── authMiddleware.js  # JWT authentication
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx              # Entry point
│   │   ├── App.jsx               # Main app component
│   │   ├── components/           # React components (6 new + 4 original)
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services (8 services)
│   │   ├── context/              # State management
│   │   └── styles/               # CSS files (6 new + 6 original)
│   └── vite.config.js
└── docs/
    ├── API_DOCUMENTATION.md      # API endpoints
    ├── TESTING_GUIDE.md          # Testing instructions
    └── IMPLEMENTATION_CHECKLIST.md # Feature checklist
```

---

## Quick Command Reference

### Backend Commands
```bash
# Install dependencies
cd backend
npm install

# Start development server
npm start

# Run with nodemon (watch mode)
npm run dev

# Run tests (when added)
npm test
```

### Frontend Commands
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database
```bash
# Database is auto-created in backend/data/database.sqlite
# SQLite file location: /backend/data/database.sqlite
```

---

## Common API Patterns

### Authentication Flow
```javascript
// 1. Register/Login to get token
POST /api/auth/register
Body: { email, password, name }
Response: { token, user }

// 2. Store token in localStorage
localStorage.setItem('token', token);

// 3. Send token in all requests
Authorization: Bearer {token}
```

### Pet-Specific Resource Pattern
```javascript
// All health features follow this pattern:
GET    /api/pets/{petId}/vaccinations
POST   /api/pets/{petId}/vaccinations
GET    /api/pets/{petId}/vaccinations/{id}
PUT    /api/pets/{petId}/vaccinations/{id}
DELETE /api/pets/{petId}/vaccinations/{id}

// Special endpoints vary by resource:
GET    /api/pets/{petId}/vaccinations/reminders
GET    /api/pets/{petId}/weight-loss/trends
GET    /api/pets/{petId}/medicine-schedule/today
```

### User-Specific Resource Pattern
```javascript
// Vacation dates work at user level:
GET    /api/vacation-dates
POST   /api/vacation-dates
GET    /api/vacation-dates/upcoming
GET    /api/vacation-dates/ongoing
```

---

## Frontend Service Usage Pattern

### Service structure in authService.js
```javascript
// All services follow this pattern:
export const vaccinationService = {
  createVaccination: async (petId, data) => {...},
  getVaccinations: async (petId) => {...},
  getReminders: async (petId) => {...},
  updateVaccination: async (petId, id, data) => {...},
  deleteVaccination: async (petId, id) => {...}
};

// Usage in components:
import { vaccinationService } from '../services/authService';

const response = await vaccinationService.createVaccination(petId, data);
```

---

## Data Validation Rules

### Vaccinations
- `vaccinationDate` (required): Valid date YYYY-MM-DD
- `nextDueDate` (required): Valid date >= vaccinationDate
- `vaccineName` (required): Non-empty string
- `status` (optional): "completed" | "pending" | "overdue"

### Weight Loss
- `weight` (required): Number > 0
- `unit` (required): "kg" or "lbs"
- `recordDate` (required): Valid date YYYY-MM-DD

### Medical History
- `visitDate` (required): Valid date
- `condition` (required): Non-empty string
- `cost` (optional): Number >= 0
- `vetClinic` (required): Non-empty string

### Medicine Schedule
- `medicineName` (required): Non-empty string
- `dosage` (required): Non-empty string
- `startDate` (required): Valid date
- `endDate` (required): Valid date >= startDate
- `frequency` (required): "once_daily" | "twice_daily" | "thrice_daily" | "as_needed"
- `morningTime` (optional): HH:MM format if frequency includes morning
- `afternoonTime` (optional): HH:MM format if frequency includes afternoon
- `nightTime` (optional): HH:MM format if frequency includes night

### Vacation Dates
- `startDate` (required): Valid date
- `endDate` (required): Valid date >= startDate
- `title` (required): Non-empty string
- `pauseServices` (optional): Boolean

### Health Reminders
- `reminderType` (required): "vaccination" | "checkup" | "appointment" | "medicine" | "weight_check" | "dental" | "custom"
- `reminderDate` (required): Valid date
- `frequency` (required): "once" | "daily" | "weekly" | "monthly" | "yearly"

---

## Component State Pattern

### Typical Component Structure
```javascript
// All health management components follow this pattern:
const [items, setItems] = useState([]);           // List of records
const [selectedPetId, setSelectedPetId] = useState('');
const [editingId, setEditingId] = useState(null);
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({});     // Form inputs
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

// Lifecycle
useEffect(() => {
  fetchItems();
}, [selectedPetId]);

// CRUD Operations
const fetchItems = async () => { /* ... */ };
const handleAdd = async () => { /* ... */ };
const handleUpdate = async () => { /* ... */ };
const handleDelete = async (id) => { /* ... */ };
const handleEdit = (item) => { /* ... */ };
const handleCancel = () => { /* ... */ };
```

---

## Common Controller Functions

### List with Filters
```javascript
// GET endpoint that returns filtered list
const getItems = async (req, res) => {
  const { petId } = req.params;
  const items = await Item.findAll({
    where: {
      petId: petId,
      userId: req.user.id
    }
  });
  res.status(200).json({
    message: 'Items retrieved successfully',
    items: items
  });
};
```

### Create with Validation
```javascript
const createItem = async (req, res) => {
  try {
    const { petId } = req.params;
    const pet = await Pet.findOne({
      where: { id: petId, userId: req.user.id }
    });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const item = await Item.create({
      ...req.body,
      petId: petId,
      userId: req.user.id
    });
    res.status(201).json({
      message: 'Item created successfully',
      item: item
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: err.message 
    });
  }
};
```

### Get with Summary/Statistics
```javascript
const getSummary = async (req, res) => {
  const { petId } = req.params;
  const records = await Record.findAll({
    where: { petId, userId: req.user.id }
  });

  const summary = {
    totalRecords: records.length,
    totalCost: records.reduce((sum, r) => sum + r.cost, 0),
    // Additional calculations...
  };

  res.status(200).json({
    message: 'Summary retrieved',
    summary: summary
  });
};
```

---

## Error Handling Patterns

### Client-Side (React)
```javascript
const handleOperation = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await service.operation();
    setItems([...items, response.data]);
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'An error occurred';
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
};
```

### Server-Side (Express)
```javascript
// Always wrap in try-catch
try {
  // Operation
  res.status(200).json({ message: 'Success', data: result });
} catch (err) {
  console.error(err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: err.message 
  });
}

// Authorization check
const pet = await Pet.findOne({ where: { id: petId } });
if (pet.userId !== req.user.id) {
  return res.status(403).json({ message: 'Unauthorized' });
}
```

---

## Enum/Status Codes Reference

### Vaccination Status
- `pending` - Not yet completed
- `completed` - Vaccination done
- `overdue` - Past due date

### Medicine Schedule Frequency
- `once_daily` - Once per day
- `twice_daily` - Twice per day (morning + afternoon)
- `thrice_daily` - Three times (morning + afternoon + night)
- `as_needed` - As needed by veterinarian

### Reminder Frequency
- `once` - One-time reminder
- `daily` - Every day
- `weekly` - Every 7 days
- `monthly` - Every month
- `yearly` - Every year

### Vacation Status
- `upcoming` - startDate > today
- `ongoing` - startDate <= today <= endDate
- `completed` - endDate < today

### Reminder Types
- `vaccination` - Vaccination reminder
- `checkup` - Regular checkup
- `appointment` - Vet appointment
- `medicine` - Medicine reminder
- `weight_check` - Weight check
- `dental` - Dental care
- `custom` - Custom reminder

---

## Testing Quick Commands

### Running Tests
```bash
# Run all tests
npm test

# Run specific file
npm test -- vaccinations.test.js

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Test File Template
```javascript
const request = require('supertest');
const app = require('../server');

describe('Vaccination API', () => {
  let token;
  let petId;

  beforeAll(async () => {
    // Setup: login, create pet, get token
  });

  test('POST /api/pets/{petId}/vaccinations - Create vaccination', async () => {
    const res = await request(app)
      .post(`/api/pets/${petId}/vaccinations`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        vaccineName: 'Rabies',
        vaccinationDate: '2024-02-15',
        nextDueDate: '2025-02-15'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.vaccination).toBeDefined();
  });
});
```

---

## Environment Configuration

### Backend .env
```
NODE_ENV=development
PORT=5000
DB_PATH=./data/database.sqlite
JWT_SECRET=your-secret-key
```

### Frontend .env
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Common Issues & Solutions

### Token Expiration
```javascript
// Check if token expired in response
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  // Redirect to login
}
```

### CORS Errors
```javascript
// Verify backend has CORS enabled:
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
```

### Database File Not Found
```bash
# Create data folder if missing
mkdir -p backend/data
# Database will auto-create on first run
```

### Module Not Found
```bash
# Install dependencies
npm install

# Clear node_modules if issues persist
rm -rf node_modules
npm install
```

---

## Performance Tips

### Backend
- Use pagination for large lists
- Add database indexes on frequently queried fields
- Cache medical summaries
- Limit date ranges in trend queries

### Frontend
- Lazy load components
- Implement virtual scrolling for long lists
- Debounce search inputs
- Cache API responses in Context

### Database
- Use indexes on userId, petId
- Implement query optimization
- Use pagination in findAll queries

---

## Deployment Checklist

- [ ] Update .env with production values
- [ ] Set NODE_ENV=production
- [ ] Update CORS origins
- [ ] Enable request logging
- [ ] Set up database backups
- [ ] Configure error monitoring
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Check HTTPS configuration
- [ ] Monitor performance metrics

---

## Useful Resources

### Documentation Files
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing strategies
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Feature checklist

### External Resources
- [Express.js Docs](https://expressjs.com/)
- [Sequelize Docs](https://sequelize.org/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)

---

## Support & Contact

For issues or questions:
1. Check documentation files
2. Review error messages carefully
3. Check console for detailed errors
4. Review TESTING_GUIDE.md for debugging patterns
5. Check controller implementations in src/controllers/

