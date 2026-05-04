# Project Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    Pet Care Application                     │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼────┐           ┌───▼────┐
    │Frontend │           │Backend │
    │ (React) │           │Express │
    └───┬────┘           └───┬────┘
        │                     │
        │ HTTP Requests       │ Database
        │ (Axios)             │ Queries
        │                     │
        └──────────┬──────────┘
                   │
             ┌─────▼─────┐
             │  Database │
             │  (SQLite) │
             └───────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthPage
│   ├── Login
│   └── Register
└── Dashboard
    ├── Navbar
    └── Tabs
        ├── PetsList
        │   ├── PetForm
        │   └── PetCards
        └── AppointmentsList
            ├── AppointmentForm
            └── AppointmentCards
```

### Data Flow

```
User Input
    ↓
Component State
    ↓
API Service (axios)
    ↓
Backend API
    ↓
Database
    ↓
Response → Local Storage (token/user)
    ↓
Component Re-render
```

### Services Structure

```
services/
├── api.js
│   └── Axios instance with interceptors
└── authService.js
    ├── authService (login, register, profile)
    ├── petService (CRUD operations)
    └── appointmentService (CRUD operations)
```

## Backend Architecture

### Request Flow

```
HTTP Request
    ↓
CORS Middleware
    ↓
Auth Middleware
    ↓
Route Handler
    ↓
Controller Logic
    ↓
Database Operation
    ↓
Response JSON
```

### Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js (Sequelize config)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── petController.js
│   │   └── appointmentController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Pet.js
│   │   ├── Appointment.js
│   │   └── index.js (associations)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── petRoutes.js
│   │   └── appointmentRoutes.js
│   └── server.js (Express app)
├── package.json
└── .env
```

## Database Schema

### Users Table
```
id (UUID, Primary Key)
email (String, Unique)
password (String, Hashed)
firstName (String)
lastName (String)
phone (String)
address (String)
city (String)
state (String)
zipCode (String)
profilePicture (String)
isEmailVerified (Boolean)
createdAt (DateTime)
updatedAt (DateTime)
```

### Pets Table
```
id (UUID, Primary Key)
userId (UUID, Foreign Key)
name (String)
type (Enum)
breed (String)
age (Integer)
weight (Float)
color (String)
microchipId (String, Unique)
dateOfBirth (DateTime)
medicalNotes (Text)
profilePicture (String)
vaccinated (Boolean)
neutered (Boolean)
createdAt (DateTime)
updatedAt (DateTime)
```

### Appointments Table
```
id (UUID, Primary Key)
petId (UUID, Foreign Key)
userId (UUID, Foreign Key)
veterinarian (String)
appointmentDate (DateTime)
description (Text)
status (Enum: scheduled, completed, cancelled)
notes (Text)
createdAt (DateTime)
updatedAt (DateTime)
```

## Authentication Flow

```
1. User Registration
   Input: email, password, name, phone
   ↓
   Hash password with bcryptjs
   ↓
   Create user in database
   ↓
   Generate JWT token (7 day expiry)
   ↓
   Return token + user info

2. User Login
   Input: email, password
   ↓
   Find user by email
   ↓
   Compare passwords (bcryptjs)
   ↓
   Generate JWT token
   ↓
   Return token + user info

3. Protected Requests
   Authorization header: "Bearer {token}"
   ↓
   authMiddleware validates token
   ↓
   Extract userId from token
   ↓
   Process request
   ↓
   Return response
```

## API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { /* ... */ }
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Additional details"
}
```

## State Management

### Frontend
- React Hooks (useState)
- localStorage for persistence
- Local component state

### Backend
- Database as source of truth
- In-memory request processing
- JWT tokens for session management

## Security Architecture

```
Frontend
├── Token Storage (localStorage)
├── Token Validation
└── Auto-logout on expiry

Backend
├── Password Hashing (bcryptjs)
├── JWT Generation/Validation
├── CORS Protection
├── Input Validation
└── SQL Injection Prevention (Sequelize)
```

## Scalability Considerations

### Current Architecture
- Single backend server
- Embedded SQLite database
- Stateless API (JWT-based)

### For Production Scaling
```
Load Balancer
    ↓
Multiple Backend Instances
    ↓
Shared Database (H2 Server)
    ↓
Redis Cache (optional)
    ↓
CDN for Frontend Assets
```

## Technology Dependencies

### Frontend
- React 18 (UI library)
- Vite (Build tool)
- Axios (HTTP client)
- React Router (SPA navigation)

### Backend
- Express.js (Web framework)
- Sequelize (ORM)
- JWT (Authentication)
- bcryptjs (Password hashing)
- SQLite3/H2 (Database)

## Error Handling Strategy

### Frontend
- API error interceptors
- User-friendly error messages
- Automatic token refresh on 401

### Backend
- Try-catch blocks
- Validation middleware
- Centralized error handler
- Detailed logging

## Performance Optimization

### Frontend
- Component lazy loading
- CSS optimization
- Image optimization
- Bundle size reduction

### Backend
- Database query optimization
- Caching strategy
- Connection pooling
- Pagination for large datasets

## Testing Strategy

### Frontend
- Component testing (Jest + React Testing Library)
- Integration testing
- E2E testing (Cypress)

### Backend
- Unit testing (Jest)
- Integration testing
- API testing (Postman)
- Load testing

## Deployment Strategy

### Staging
- Test all features
- Performance testing
- Security audit

### Production
- Blue-green deployment
- Rollback capability
- Monitoring & logging
- Backup & recovery
