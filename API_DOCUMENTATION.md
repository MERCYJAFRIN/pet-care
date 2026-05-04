# Pet Care Application - Complete API Documentation

## Overview
This document provides comprehensive API documentation for all endpoints in the Pet Care Application, including all new features developed in Phase 2.

---

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## 1. VACCINATION MANAGEMENT

### Create Vaccination Record
**POST** `/api/pets/{petId}/vaccinations`

**Request Body:**
```json
{
  "vaccineName": "Rabies",
  "vaccinationDate": "2024-02-15",
  "nextDueDate": "2025-02-15",
  "vetClinic": "Pet Clinic ABC",
  "vetName": "Dr. Smith",
  "batchNumber": "BCH-2024-001",
  "sideEffects": "",
  "notes": "No side effects observed"
}
```

**Response:** `201 Created`
```json
{
  "message": "Vaccination record created successfully",
  "vaccination": { ... }
}
```

---

### Get All Vaccinations for Pet
**GET** `/api/pets/{petId}/vaccinations`

**Response:** `200 OK`
```json
{
  "message": "Vaccinations retrieved successfully",
  "vaccinations": [ ... ]
}
```

---

### Get Vaccination Reminders
**GET** `/api/pets/{petId}/vaccinations/reminders`

**Response:** `200 OK`
```json
{
  "message": "Vaccination reminders retrieved",
  "overdue": [ ... ],
  "upcoming": [ ... ]
}
```

---

### Get Specific Vaccination
**GET** `/api/pets/{petId}/vaccinations/{vaccinationId}`

**Response:** `200 OK`

---

### Update Vaccination
**PUT** `/api/pets/{petId}/vaccinations/{vaccinationId}`

**Request Body:** Same as Create

---

### Delete Vaccination
**DELETE** `/api/pets/{petId}/vaccinations/{vaccinationId}`

**Response:** `200 OK`
```json
{
  "message": "Vaccination deleted successfully"
}
```

---

## 2. WEIGHT LOSS TRACKING

### Create Weight Record
**POST** `/api/pets/{petId}/weight-loss`

**Request Body:**
```json
{
  "weight": 25.5,
  "unit": "kg",
  "recordDate": "2024-02-16",
  "notes": "Pet exercised well today"
}
```

**Response:** `201 Created`

---

### Get Weight Records
**GET** `/api/pets/{petId}/weight-loss?startDate=2024-01-01&endDate=2024-02-16`

**Query Parameters:**
- `startDate` (optional): Start date for filtering
- `endDate` (optional): End date for filtering

**Response:** `200 OK`
```json
{
  "message": "Weight records retrieved successfully",
  "weightRecords": [ ... ],
  "stats": {
    "initialWeight": 28.0,
    "currentWeight": 25.5,
    "weightDifference": -2.5,
    "percentChange": "-8.93",
    "totalRecords": 5,
    "unit": "kg"
  }
}
```

---

### Get Weight Trends
**GET** `/api/pets/{petId}/weight-loss/trends?period=month`

**Query Parameters:**
- `period`: "week", "month", or "year"

**Response:** `200 OK`

---

### Update Weight Record
**PUT** `/api/pets/{petId}/weight-loss/{recordId}`

**Request Body:** Same as Create

---

### Delete Weight Record
**DELETE** `/api/pets/{petId}/weight-loss/{recordId}`

---

## 3. MEDICAL HISTORY TRACKING

### Create Medical History Record
**POST** `/api/pets/{petId}/medical-history`

**Request Body:**
```json
{
  "visitDate": "2024-02-15",
  "vetClinic": "Happy Paws Clinic",
  "vetName": "Dr. Johnson",
  "condition": "Annual Checkup",
  "diagnosis": "Healthy, all vitals normal",
  "treatment": "Prescribed vitamins",
  "prescription": "Pet-Vit 1 tablet daily for 30 days",
  "notes": "Follow-up in 6 months",
  "cost": 150.00,
  "attachments": []
}
```

**Response:** `201 Created`

---

### Get Medical History
**GET** `/api/pets/{petId}/medical-history`

**Response:** `200 OK`
```json
{
  "message": "Medical history retrieved successfully",
  "records": [ ... ],
  "count": 5
}
```

---

### Get Medical Summary
**GET** `/api/pets/{petId}/medical-history/summary`

**Response:** `200 OK`
```json
{
  "message": "Medical summary retrieved successfully",
  "summary": {
    "totalVisits": 5,
    "totalCost": 750.00,
    "conditions": ["Annual Checkup", "Ear Infection"],
    "lastVisit": { ... },
    "recentConditions": [ ... ]
  }
}
```

---

### Get Medical History by Condition
**GET** `/api/pets/{petId}/medical-history/condition/{condition}`

**Response:** `200 OK`

---

### Update Medical Record
**PUT** `/api/pets/{petId}/medical-history/{recordId}`

**Request Body:** Same as Create

---

### Delete Medical Record
**DELETE** `/api/pets/{petId}/medical-history/{recordId}`

---

## 4. MEDICINE SCHEDULE MANAGEMENT

### Create Medicine Schedule
**POST** `/api/pets/{petId}/medicine-schedule`

**Request Body:**
```json
{
  "medicineName": "Amoxicillin",
  "dosage": "500mg",
  "startDate": "2024-02-16",
  "endDate": "2024-03-02",
  "frequency": "twice_daily",
  "morningTime": "08:00",
  "afternoonTime": "20:00",
  "nightTime": "",
  "reason": "Ear infection treatment",
  "sideEffects": "",
  "notes": "Take with food"
}
```

**Response:** `201 Created`

---

### Get Medicine Schedules
**GET** `/api/pets/{petId}/medicine-schedule?status=active`

**Query Parameters:**
- `status` (optional): "active", "completed", or "paused"

**Response:** `200 OK`

---

### Get Today's Medicines
**GET** `/api/pets/{petId}/medicine-schedule/today`

**Response:** `200 OK`
```json
{
  "message": "Today's medicines retrieved successfully",
  "date": "2024-02-16",
  "schedules": [ ... ],
  "count": 2
}
```

---

### Get Active Medicines
**GET** `/api/pets/{petId}/medicine-schedule/active`

**Response:** `200 OK`

---

### Update Medicine Schedule
**PUT** `/api/pets/{petId}/medicine-schedule/{scheduleId}`

**Request Body:** Same as Create

---

### Update Medicine Status
**PUT** `/api/pets/{petId}/medicine-schedule/{scheduleId}/status`

**Request Body:**
```json
{
  "timeOfDay": "morning",
  "status": "completed"
}
```

**Parameters:**
- `timeOfDay`: "morning", "afternoon", or "night"
- `status`: "pending", "completed", or "missed"

---

### Delete Medicine Schedule
**DELETE** `/api/pets/{petId}/medicine-schedule/{scheduleId}`

---

## 5. VACATION DATE MANAGEMENT

### Create Vacation Dates
**POST** `/api/vacation-dates`

**Request Body:**
```json
{
  "petId": "optional-pet-uuid",
  "startDate": "2024-06-01",
  "endDate": "2024-06-15",
  "title": "Summer Vacation",
  "description": "Family trip to beach",
  "location": "Gold Coast, Australia",
  "pauseServices": true
}
```

**Response:** `201 Created`

---

### Get Vacation Dates
**GET** `/api/vacation-dates?status=upcoming`

**Query Parameters:**
- `status` (optional): "upcoming", "ongoing", or "completed"

**Response:** `200 OK`

---

### Get Upcoming Vacations
**GET** `/api/vacation-dates/upcoming`

**Response:** `200 OK`
```json
{
  "message": "Upcoming vacations retrieved successfully",
  "vacations": [ ... ],
  "count": 2
}
```

---

### Get Ongoing Vacation
**GET** `/api/vacation-dates/ongoing`

**Response:** `200 OK`

---

### Update Vacation Dates
**PUT** `/api/vacation-dates/{vacationId}`

**Request Body:** Same as Create

---

### Delete Vacation Dates
**DELETE** `/api/vacation-dates/{vacationId}`

---

## 6. HEALTH REMINDERS

### Create Health Reminder
**POST** `/api/pets/{petId}/health-reminders`

**Request Body:**
```json
{
  "reminderType": "vaccination",
  "title": "Rabies Vaccination Due",
  "description": "Annual rabies vaccination needed",
  "reminderDate": "2024-03-15",
  "frequency": "yearly",
  "notes": "Schedule at Pet Clinic ABC"
}
```

**Response:** `201 Created`

---

### Get Health Reminders
**GET** `/api/pets/{petId}/health-reminders?reminderType=vaccination&isActive=true`

**Query Parameters:**
- `reminderType` (optional): "vaccination", "checkup", "appointment", etc.
- `isActive` (optional): "true" or "false"

**Response:** `200 OK`

---

### Get Upcoming Reminders
**GET** `/api/pets/{petId}/health-reminders/upcoming`

**Response (7-day window):** `200 OK`

---

### Get Overdue Reminders
**GET** `/api/pets/{petId}/health-reminders/overdue`

**Response:** `200 OK`

---

### Update Health Reminder
**PUT** `/api/pets/{petId}/health-reminders/{reminderId}`

**Request Body:** Same as Create

---

### Mark Reminder Completed
**PUT** `/api/pets/{petId}/health-reminders/{reminderId}/complete`

**Response:** `200 OK`
```json
{
  "message": "Reminder marked as completed",
  "reminder": { ... }
}
```

---

### Delete Health Reminder
**DELETE** `/api/pets/{petId}/health-reminders/{reminderId}`

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input",
  "error": "Details of the error"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error",
  "error": "Error details"
}
```

---

## Reminder Types
- `vaccination`: Vaccination records
- `checkup`: Regular health check-ups
- `appointment`: Veterinary appointments
- `medicine`: Medicine timing reminders
- `weight_check`: Weight monitoring
- `dental`: Dental care
- `custom`: Custom reminders

---

## Reminder Frequencies
- `once`: One-time reminder
- `daily`: Daily recurrence
- `weekly`: Weekly recurrence
- `monthly`: Monthly recurrence
- `yearly`: Yearly recurrence

---

## Status Values
- `active`: Currently in use
- `completed`: Finished
- `paused`: Temporarily paused
- `pending`: Awaiting action
- `missed`: Action not taken

---

## Notes
All dates should be in `YYYY-MM-DD` format.
All times should be in `HH:MM` format (24-hour).
Currency amounts are in the application's default currency.
