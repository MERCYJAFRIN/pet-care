# Pet Care Application - API Testing & Validation Guide

## Overview
This guide provides comprehensive instructions for testing and validating all API endpoints in the Pet Care Application.

---

## Prerequisites

### Installation
```bash
# In backend directory
npm install jest supertest --save-dev
```

### Test Configuration
Jest is configured in `package.json` under scripts:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Testing Strategy

### Unit Tests
- Test individual controller functions
- Mock database responses
- Validate business logic
- Check error handling

### Integration Tests
- Test API endpoints directly
- Use test database
- Validate request/response flow
- Check authorization

### Coverage Goals
- Minimum 80% code coverage
- All critical paths
- All error scenarios
- All authorization checks

---

## API Testing Scenarios

### 1. Vaccination Management Tests

#### Test: Create Vaccination Record
```bash
POST /api/pets/{petId}/vaccinations
Content-Type: application/json
Authorization: Bearer {token}

{
  "vaccineName": "Rabies",
  "vaccinationDate": "2024-02-15",
  "nextDueDate": "2025-02-15",
  "vetClinic": "Pet Clinic ABC"
}
```

**Expected Response:**
- Status: 201 Created
- Body contains vaccination object with ID

**Test Scenarios:**
- ✓ Valid vaccination creation
- ✗ Missing required fields
- ✗ Invalid petId
- ✗ Unauthorized access
- ✗ Invalid date format

#### Test: Get Vaccination Reminders
```bash
GET /api/pets/{petId}/vaccinations/reminders
Authorization: Bearer {token}
```

**Expected Response:**
- Status: 200 OK
- Contains `overdue` and `upcoming` arrays
- Correctly filters by nextDueDate

**Test Scenarios:**
- ✓ Retrieve all reminders
- ✓ Overdue reminders (nextDueDate < today)
- ✓ Upcoming reminders (nextDueDate >= today)

---

### 2. Weight Loss Tracking Tests

#### Test: Create Weight Record
```bash
POST /api/pets/{petId}/weight-loss
Content-Type: application/json
Authorization: Bearer {token}

{
  "weight": 25.5,
  "unit": "kg",
  "recordDate": "2024-02-16"
}
```

**Expected Response:**
- Status: 201 Created
- Automatic stats calculation

#### Test: Get Weight Statistics
```bash
GET /api/pets/{petId}/weight-loss
Authorization: Bearer {token}
```

**Expected Response:**
- Status: 200 OK
- includes `stats` object with:
  - `initialWeight`: First recorded weight
  - `currentWeight`: Latest weight
  - `weightDifference`: Numeric difference
  - `percentChange`: Percentage format
  - `totalRecords`: Count of records

**Calculations Validation:**
```
weightDifference = currentWeight - initialWeight
percentChange = (weightDifference / initialWeight) * 100
```

#### Test: Weight Trends Analysis
```bash
GET /api/pets/{petId}/weight-loss/trends?period=month
Authorization: Bearer {token}
```

**Expected Response:**
- Status: 200 OK
- Filtered records for specified period
- Trend analysis data

**Test Scenarios:**
- ✓ Weekly trends
- ✓ Monthly trends
- ✓ Yearly trends
- ✓ Date range filtering

---

### 3. Medical History Tests

#### Test: Create Medical Record
```bash
POST /api/pets/{petId}/medical-history
Content-Type: application/json
Authorization: Bearer {token}

{
  "visitDate": "2024-02-15",
  "vetClinic": "Happy Paws Clinic",
  "condition": "Annual Checkup",
  "cost": 150.00
}
```

#### Test: Get Medical Summary
```bash
GET /api/pets/{petId}/medical-history/summary
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "summary": {
    "totalVisits": 5,
    "totalCost": 750.00,
    "conditions": ["Annual Checkup", "Ear Infection"],
    "lastVisit": { ... },
    "recentConditions": [ ... ]
  }
}
```

**Validation:**
- ✓ totalVisits = COUNT of records
- ✓ totalCost = SUM of costs
- ✓ conditions = UNIQUE list
- ✓ lastVisit = Record with max visitDate

#### Test: Search by Condition
```bash
GET /api/pets/{petId}/medical-history/condition/infection
Authorization: Bearer {token}
```

**Expected Response:**
- Status: 200 OK
- Records where condition ILIKE '%infection%'

---

### 4. Medicine Schedule Tests

#### Test: Create Medicine Schedule
```bash
POST /api/pets/{petId}/medicine-schedule
Content-Type: application/json
Authorization: Bearer {token}

{
  "medicineName": "Amoxicillin",
  "dosage": "500mg",
  "startDate": "2024-02-16",
  "frequency": "twice_daily",
  "morningTime": "08:00",
  "afternoonTime": "20:00"
}
```

#### Test: Get Today's Medicines
```bash
GET /api/pets/{petId}/medicine-schedule/today
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "date": "2024-02-16",
  "schedules": [
    {
      "medicineName": "Amoxicillin",
      "morning": { "time": "08:00", "status": "pending" },
      "afternoon": { "time": "20:00", "status": "pending" }
    }
  ]
}
```

**Validation:**
- startDate <= today <= endDate
- Only medicines scheduled for today
- Correct times for scheduled periods

#### Test: Update Medicine Status
```bash
PUT /api/pets/{petId}/medicine-schedule/{scheduleId}/status
Content-Type: application/json
Authorization: Bearer {token}

{
  "timeOfDay": "morning",
  "status": "completed"
}
```

**Test Scenarios:**
- ✓ Mark morning dose as completed
- ✓ Mark afternoon dose as completed
- ✓ Mark night dose as completed
- ✓ Mark dose as missed
- ✗ Invalid timeOfDay
- ✗ Invalid status value

---

### 5. Vacation Date Tests

#### Test: Create Vacation
```bash
POST /api/vacation-dates
Content-Type: application/json
Authorization: Bearer {token}

{
  "startDate": "2024-06-01",
  "endDate": "2024-06-15",
  "title": "Summer Vacation",
  "pauseServices": true
}
```

#### Test: Get Ongoing Vacation
```bash
GET /api/vacation-dates/ongoing
Authorization: Bearer {token}
```

**Expected Response:**
- Status: 200 OK
- If vacation exists where startDate <= today <= endDate

**Validation:**
```javascript
const today = new Date();
const isOngoing = startDate <= today && endDate >= today;
```

#### Test: Get Upcoming Vacations
```bash
GET /api/vacation-dates/upcoming
Authorization: Bearer {token}
```

**Expected Response:**
- Vacations where startDate > today
- Ordered by startDate ascending

---

### 6. Health Reminder Tests

#### Test: Create Reminder
```bash
POST /api/pets/{petId}/health-reminders
Content-Type: application/json
Authorization: Bearer {token}

{
  "reminderType": "vaccination",
  "reminderDate": "2024-03-15",
  "frequency": "yearly"
}
```

#### Test: Mark Reminder Completed
```bash
PUT /api/pets/{petId}/health-reminders/{reminderId}/complete
Authorization: Bearer {token}
```

**Expected Behavior:**
- If frequency != "once":
  - Calculate next reminder date based on frequency
  - Update nextReminderDate
- Mark completed and set completedDate
- Update completed status

**Frequency Calculation:**
```javascript
function calculateNextReminderDate(currentDate, frequency) {
  const next = new Date(currentDate);
  switch(frequency) {
    case 'daily': next.setDate(next.getDate() + 1); break;
    case 'weekly': next.setDate(next.getDate() + 7); break;
    case 'monthly': next.setMonth(next.getMonth() + 1); break;
    case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
  }
  return next;
}
```

#### Test: Get Overdue Reminders
```bash
GET /api/pets/{petId}/health-reminders/overdue
Authorization: Bearer {token}
```

**Expected Response:**
- Reminders where nextReminderDate < today
- sorted by nextReminderDate ascending

#### Test: Get Upcoming Reminders
```bash
GET /api/pets/{petId}/health-reminders/upcoming
Authorization: Bearer {token}
```

**Expected Response:**
- Reminders where nextReminderDate <= today + 7 days
- Reminders where nextReminderDate > today

---

## Authorization Tests

### Test: Protected Endpoints
```bash
GET /api/pets/{petId}/vaccinations
# No Authorization Header
```

**Expected Response:**
- Status: 401 Unauthorized
- Message: "No token provided"

### Test: Invalid Token
```bash
GET /api/pets/{petId}/vaccinations
Authorization: Bearer invalid-token
```

**Expected Response:**
- Status: 401 Unauthorized
- Message: "Invalid token"

### Test: Cross-User Access
```bash
# User A's token, User B's pet
GET /api/pets/{userB-petId}/vaccinations
Authorization: Bearer {userA-token}
```

**Expected Response:**
- Status: 403 Forbidden
- Message: "Unauthorized"

---

## Data Validation Tests

### Test: Invalid Dates
```bash
POST /api/pets/{petId}/vaccinations
Body: {
  "vaccinationDate": "invalid-date",
  "nextDueDate": "2025-02-15"
}
```

**Expected Response:**
- Status: 400 Bad Request
- Error message about date format

### Test: Invalid Numbers
```bash
POST /api/pets/{petId}/weight-loss
Body: {
  "weight": "not-a-number",
  "unit": "kg"
}
```

**Expected Response:**
- Status: 400 Bad Request
- Error message about weight format

### Test: Invalid Enums
```bash
POST /api/pets/{petId}/medicine-schedule
Body: {
  "frequency": "three_times_daily"
}
```

**Expected Response:**
- Status: 400 Bad Request
- Error message about invalid frequency

---

## Performance Testing

### Load Test: Get Vaccinations (100 records)
```bash
GET /api/pets/{petId}/vaccinations
```

**Expected:**
- Response time < 200ms
- Complete dataset retrieval

### Load Test: Weight Trends (365 days)
```bash
GET /api/pets/{petId}/weight-loss/trends?period=year
```

**Expected:**
- Response time < 500ms
- Proper data aggregation

---

## Edge Cases

### Test: Overlapping Medicine Schedules
```
Schedule 1: 2024-02-01 to 2024-02-15
Schedule 2: 2024-02-10 to 2024-02-28
Today: 2024-02-12
```

**Expected:** Both medicines appear in today's list

### Test: Vacation Across Year Boundary
```
Vacation: 2023-12-25 to 2024-01-05
Today: 2024-01-01
```

**Expected:** Correctly identified as ongoing

### Test: Delete with Dependencies
```
Delete vaccine that has reminders
```

**Expected:** Cascade delete removes reminders

---

## Test Checklist

### Vaccination Module
- [ ] Create valid vaccination
- [ ] Create with missing fields
- [ ] Get all vaccinations
- [ ] Get reminders (overdue)
- [ ] Get reminders (upcoming)
- [ ] Update vaccination
- [ ] Delete vaccination
- [ ] Get by invalid ID
- [ ] Unauthorized access

### Weight Loss Module
- [ ] Create weight record
- [ ] Calculate statistics correctly
- [ ] Weight loss scenario (weight decreases)
- [ ] Weight gain scenario (weight increases)
- [ ] Trend analysis (weekly/monthly/yearly)
- [ ] Date range filtering
- [ ] Unit conversion support (kg/lbs)

### Medical History Module
- [ ] Create medical record
- [ ] Get all records
- [ ] Generate accurate summary
- [ ] Search by condition
- [ ] Total cost calculation
- [ ] Condition deduplication
- [ ] Update record
- [ ] Delete record

### Medicine Schedule Module
- [ ] Create schedule
- [ ] Get today's medicines
- [ ] Get active medicines
- [ ] Update status (morning/afternoon/night)
- [ ] Frequency options
- [ ] Time validation
- [ ] Delete schedule

### Vacation Dates Module
- [ ] Create vacation
- [ ] Get upcoming vacations
- [ ] Get ongoing vacation
- [ ] Pause services flag
- [ ] Pet-specific vacations
- [ ] All pets vacation
- [ ] Delete vacation

### Health Reminders Module
- [ ] Create reminder
- [ ] Get by type
- [ ] Get overdue
- [ ] Get upcoming (7-day window)
- [ ] Mark completed
- [ ] Frequency recalculation
- [ ] Delete reminder

---

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- vaccinations.test.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## Troubleshooting

### Common Issues

**Issue:** "Cannot find module"
- Solution: Ensure npm install in backend directory

**Issue:** Database connection failed
- Solution: Check database.js configuration
- Verify SQLite file exists

**Issue:** Token validation failed
- Solution: Verify JWT secret matches
- Check token expiration

---

## Continuous Integration

### GitHub Actions (Optional)
Create `.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

