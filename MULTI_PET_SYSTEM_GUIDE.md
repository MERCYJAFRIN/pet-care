# Multi-Pet Veterinary Management System - Developer Guide

## System Overview

The Multi-Pet Veterinary Management System is a comprehensive full-stack application designed to help pet owners manage multiple pets' health, appointments, vaccinations, and medical records. The system includes:

- **Multi-pet management** - Register and manage multiple pets per user
- **Health monitoring** - Track weight, temperature, and other health metrics
- **Vaccination management** - Track vaccination status and receive reminders
- **Appointment scheduling** - Book veterinary appointments with payment integration
- **Medical history** - Maintain comprehensive medical records
- **Analytics dashboard** - Visual insights with charts and graphs
- **Payment processing** - Secure Razorpay integration for appointment fees
- **Notification system** - Automated reminders for vaccinations and appointments

## Architecture

### Tech Stack

**Backend:**
- Node.js with Express.js
- SQLite database with Sequelize ORM
- Razorpay for payment processing
- node-cron for scheduled tasks

**Frontend:**
- React 18 with Vite
- Axios for API calls
- Recharts for data visualization
- CSS3 for styling

### Directory Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business services
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Application entry point
├── data/                # Database files
└── package.json

frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── styles/          # CSS styles
│   ├── context/         # React context
│   └── main.jsx         # Entry point
└── package.json
```

## Database Models

### User Model
Stores user account information and authentication details.

```javascript
{
  id: UUID (Primary Key),
  email: String (Unique),
  password: String (Hashed),
  firstName: String,
  lastName: String,
  phone: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Pet Model
Stores information about each pet owned by a user.

```javascript
{
  id: UUID (Primary Key),
  userId: UUID (Foreign Key),
  name: String,
  type: String (dog, cat, bird, etc.),
  breed: String,
  dateOfBirth: Date,
  gender: String,
  weight: Decimal,
  profilePicture: String (URL),
  microchipId: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Appointment Model
Stores veterinary appointment information with payment details.

```javascript
{
  id: UUID (Primary Key),
  petId: UUID (Foreign Key),
  userId: UUID (Foreign Key),
  veterinarian: String,
  appointmentDate: DateTime,
  description: Text,
  status: ENUM('scheduled', 'completed', 'cancelled'),
  notes: Text,
  fee: Decimal (Default: 500.00),
  paymentStatus: ENUM('pending', 'initiated', 'completed', 'failed', 'cancelled'),
  paymentMethod: ENUM('razorpay', 'wallet', 'cash'),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paymentDate: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### HealthMetrics Model
Tracks weight, temperature, and other health metrics.

```javascript
{
  id: UUID (Primary Key),
  petId: UUID (Foreign Key),
  userId: UUID (Foreign Key),
  weight: Decimal,
  temperature: Decimal,
  heartRate: Integer,
  appetite: String,
  activityLevel: String,
  recordedDate: DateTime,
  notes: Text,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Vaccination Model
Manages vaccination records and due dates.

```javascript
{
  id: UUID (Primary Key),
  petId: UUID (Foreign Key),
  userId: UUID (Foreign Key),
  vaccineName: String,
  vaccinationDate: Date,
  nextDueDate: Date,
  veterinarian: String,
  notes: String,
  status: ENUM('completed', 'pending', 'overdue'),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### MedicalHistory Model
Stores medical visit records and conditions.

```javascript
{
  id: UUID (Primary Key),
  petId: UUID (Foreign Key),
  userId: UUID (Foreign Key),
  condition: String,
  visitDate: Date,
  diagnosis: Text,
  treatment: Text,
  veterinarian: String,
  notes: Text,
  status: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Notification Model
Tracks notifications sent to users.

```javascript
{
  id: UUID (Primary Key),
  userId: UUID (Foreign Key),
  petId: UUID (Foreign Key),
  notificationType: String,
  title: String,
  message: Text,
  relatedId: String,
  priority: ENUM('low', 'normal', 'high', 'urgent'),
  status: ENUM('unread', 'read'),
  scheduledFor: DateTime,
  sentAt: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

## API Endpoints

### Authentication Endpoints

**POST /api/auth/register**
Register a new user account.

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9876543210"
}
```

**POST /api/auth/login**
Login with email and password. Returns JWT token.

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Pet Management Endpoints

**POST /api/pets**
Create a new pet profile.

```json
{
  "name": "Buddy",
  "type": "dog",
  "breed": "Golden Retriever",
  "dateOfBirth": "2021-04-15",
  "gender": "male",
  "weight": 32.5,
  "microchipId": "ABC123456"
}
```

**GET /api/pets**
Get all pets for the authenticated user.

**GET /api/pets/{petId}**
Get details of a specific pet.

### Appointment Endpoints

**POST /api/appointments**
Create a new appointment.

```json
{
  "petId": "pet-uuid",
  "veterinarian": "Dr. Smith",
  "appointmentDate": "2024-03-15T10:30:00",
  "description": "Annual checkup",
  "fee": 500
}
```

**GET /api/appointments**
Get all appointments for the user.

**GET /api/appointments/{appointmentId}**
Get appointment details.

**PUT /api/appointments/{appointmentId}**
Update appointment details.

**DELETE /api/appointments/{appointmentId}**
Cancel appointment.

### Payment Endpoints

**POST /api/payments/create-order**
Create a Razorpay order for appointment payment.

```json
{
  "appointmentId": "appointment-uuid",
  "amount": 500,
  "description": "Appointment booking fee"
}
```

Response:
```json
{
  "success": true,
  "orderId": "order_xxx",
  "appointmentId": "appointment-uuid",
  "amount": 50000,
  "currency": "INR"
}
```

**POST /api/payments/verify**
Verify payment signature and confirm payment.

```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "sig_xxx",
  "appointmentId": "appointment-uuid"
}
```

**GET /api/payments/status/{appointmentId}**
Get payment status for an appointment.

**GET /api/payments/history**
Get payment history for the user.

**POST /api/payments/refund**
Refund a completed payment.

### Analytics Endpoints

**GET /api/pets/{petId}/analytics/weight-trend?days=90**
Get weight trend data for line chart.

Response:
```json
{
  "petId": "pet-uuid",
  "days": 90,
  "data": [
    { "date": "2024-01-15", "weight": 30 },
    { "date": "2024-01-22", "weight": 31 },
    ...
  ],
  "stats": {
    "current": 32.5,
    "min": 28,
    "max": 33,
    "average": 31.2
  }
}
```

**GET /api/pets/{petId}/analytics/temperature-trend?days=30**
Get temperature trend data.

**GET /api/pets/{petId}/analytics/vaccination-status**
Get vaccination completion status (radial chart data).

Response:
```json
{
  "petId": "pet-uuid",
  "vaccinationStatus": {
    "completed": 8,
    "pending": 2,
    "overdue": 1
  },
  "total": 11,
  "vaccinations": [...]
}
```

**GET /api/pets/{petId}/analytics/medical-conditions**
Get medical condition analytics.

**GET /api/pets/{petId}/analytics/dashboard**
Get comprehensive pet health dashboard summary.

Response:
```json
{
  "pet": {
    "id": "pet-uuid",
    "name": "Buddy",
    "type": "dog",
    "breed": "Golden Retriever",
    "dateOfBirth": "2021-04-15"
  },
  "latestMetrics": {
    "temperature": 38.5,
    "weight": 32.5,
    "heartRate": 85,
    "appetite": "normal",
    "activityLevel": "active",
    "recordedDate": "2024-02-18"
  },
  "upcomingAppointments": [...],
  "overdueVaccinations": [...],
  "recentMedicalHistory": [...]
}
```

### Vaccination Endpoints

**POST /api/pets/{petId}/vaccinations**
Create a vaccination record.

```json
{
  "vaccineName": "Rabies",
  "vaccinationDate": "2024-02-18",
  "nextDueDate": "2025-02-18",
  "veterinarian": "Dr. Smith"
}
```

**GET /api/pets/{petId}/vaccinations**
Get all vaccination records for a pet.

### Health Reminders Endpoints

**POST /api/pets/{petId}/health-reminders**
Create a health reminder.

```json
{
  "reminderType": "medication",
  "title": "Morning Medication",
  "description": "Give daily medication",
  "reminderDate": "2024-02-19T09:00:00"
}
```

**GET /api/pets/{petId}/health-reminders**
Get all health reminders for a pet.

## Payment Integration - Razorpay

### Setup

1. **Get API Credentials:**
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
   - Generate API keys (Key ID and Key Secret)

2. **Environment Configuration:**

Create `.env` file in backend directory:
```
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

Create `.env` file in frontend directory:
```
REACT_APP_RAZORPAY_KEY_ID=your_key_id_here
```

### Payment Flow

1. **User creates appointment**
   - Frontend: `POST /api/appointments`
   - Creates appointment with `paymentStatus: 'pending'`

2. **User initiates payment**
   - Frontend: `POST /api/payments/create-order`
   - Backend creates Razorpay order
   - Updates appointment with `razorpayOrderId` and `paymentStatus: 'initiated'`

3. **Razorpay checkout opens**
   - Razorpay modal displays payment options
   - User completes payment

4. **Payment verification**
   - Frontend: `POST /api/payments/verify`
   - Backend verifies Razorpay signature
   - Updates appointment with payment details and `paymentStatus: 'completed'`

5. **Confirmation**
   - User receives confirmation
   - Email notification sent
   - Appointment marked as paid

### Payment Status States

- **pending**: Appointment created, no payment initiated
- **initiated**: Order created, awaiting payment
- **completed**: Payment verified and successful
- **failed**: Payment failed verification
- **cancelled**: Appointment/payment cancelled

## Notification System

### Scheduled Tasks (using node-cron)

The notification scheduler runs automated tasks at specified intervals:

1. **Every Hour**: Check due health reminders
2. **Every Day at 8 AM**: Check vaccinations due within 5 days
3. **Every Day at 12 PM**: Check appointments scheduled for tomorrow
4. **Every 6 Hours**: Send pending notifications

### Notification Types

1. **Vaccination Reminder**
   - Triggered when vaccination is due within 5 days
   - Priority: High (Urgent if due within 1 day)

2. **Medical Appointment Reminder**
   - Triggered 1 day before appointment
   - Priority: High

3. **Health Reminder**
   - Custom reminders set by user
   - Priority: User-defined

### Notification Status Flow

```
Created (unread)
  ↓
Scheduled
  ↓
Sent (sentAt timestamp set)
  ↓
Read (user marks as read)
```

## Multi-Pet Management

### Key Features

1. **Pet Registration**
   - Each user can register multiple pets
   - Each pet has unique ID (UUID)

2. **Separate Medical Records**
   - Each pet maintains independent:
     - Health metrics
     - Vaccination records
     - Medical history
     - Appointments
     - Reminders

3. **Shared User Context**
   - All pets linked to user via `userId`
   - Single authentication covers all pets
   - Unified dashboard with pet selector

### Data Relationships

```
User (1) ──────────► (Many) Pet
                        ↓
                    ├─► Appointment
                    ├─► Vaccination
                    ├─► HealthMetrics
                    ├─► MedicalHistory
                    ├─► HealthReminder
                    └─► Notification
```

## Analytics Dashboard Features

### Weight Growth Chart
- **Chart Type**: Line Chart
- **Data**: Historical weight records
- **Metrics Displayed**:
  - Current weight
  - Minimum weight
  - Maximum weight
  - Average weight
- **Time Periods**: 30, 60, 90, 180, 365 days

### Vaccination Status Chart
- **Chart Type**: Radar Chart
- **Data**: Vaccination completion status
- **Metrics Displayed**:
  - Completed vaccinations
  - Pending vaccinations
  - Overdue vaccinations
- **Actions**: Quick view of vaccination overview

### Temperature Monitoring
- **Chart Type**: Line Chart
- **Data**: Temperature readings over time
- **Normal Range**: 37.5°C - 39.2°C
- **Alerts**: Shows abnormal readings

### Medical Conditions Overview
- **Chart Type**: Bar Chart
- **Data**: Frequency of medical conditions
- **Purpose**: Identify recurring health issues

### Health Summary Cards
- Current weight
- Current temperature (with normal range indicator)
- Upcoming appointments count
- Overdue vaccinations alert

## Environment Variables

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_NAME=pet_care_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server
PORT=5000
NODE_ENV=development
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Installation & Setup

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup
- SQLite database automatically creates on first run
- Sequelize performs automatic migrations

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error code",
  "message": "Error description"
}
```

## Authentication

All protected endpoints require Bearer token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

Token obtained from `/api/auth/login` endpoint.

## Security Features

1. **Password Hashing**: bcryptjs for secure password storage
2. **JWT Authentication**: Stateless API authentication
3. **CORS**: Cross-Origin Resource Sharing configured
4. **Razorpay Signature Verification**: Payment authenticity validated
5. **Environment Variables**: Sensitive data never hardcoded

## Error Handling

Common HTTP Status Codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Server Error

## Best Practices

1. **Always include petId** in pet-specific endpoints
2. **Validate data** before submission
3. **Handle loading states** in UI
4. **Implement error boundaries** in React
5. **Use pagination** for large datasets
6. **Cache frequently accessed data**
7. **Implement rate limiting** for API calls

## Common Issues & Solutions

### Issue: Payment fails
**Solution**: Verify Razorpay keys are correct and webhook URLs are configured

### Issue: Notifications not sending
**Solution**: Check scheduler initialization and ensure all models are loaded

### Issue: CORS errors
**Solution**: Ensure backend CORS is configured and frontend URL is whitelisted

### Issue: Database connection fails
**Solution**: Check SQLite file permissions and database path

## Future Enhancements

1. Email/SMS notifications
2. Prescription management
3. Vet clinic integration
4. Pet insurance integration
5. Telemedicine appointments
6. Multi-language support
7. Mobile app (React Native)
8. Advanced reporting
9. Pet community features
10. Microservice architecture

## Support & Contribution

For issues or feature requests, please create an issue in the repository.

## License

ISC License
