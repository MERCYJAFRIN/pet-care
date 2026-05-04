# Pet Care App - Backend

Node.js + Express backend for the Pet Care App with H2/SQLite database integration.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── petController.js     # Pet management logic
│   │   └── appointmentController.js  # Appointment logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Pet.js               # Pet model
│   │   ├── Appointment.js       # Appointment model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── petRoutes.js         # Pet endpoints
│   │   └── appointmentRoutes.js # Appointment endpoints
│   └── server.js                # Express server entry point
├── .env                         # Environment variables
└── package.json                 # Dependencies
```

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_change_this_in_production
H2_URL=http://localhost:8082
H2_DB_PATH=./data/petcare
```

## Running the Backend

### Development Mode (with nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The backend will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Pets
- `POST /api/pets` - Create a new pet (protected)
- `GET /api/pets` - Get all user's pets (protected)
- `GET /api/pets/:petId` - Get specific pet (protected)
- `PUT /api/pets/:petId` - Update pet (protected)
- `DELETE /api/pets/:petId` - Delete pet (protected)

### Appointments
- `POST /api/appointments` - Create appointment (protected)
- `GET /api/appointments` - Get all appointments (protected)
- `GET /api/appointments/:appointmentId` - Get specific appointment (protected)
- `PUT /api/appointments/:appointmentId` - Update appointment (protected)
- `DELETE /api/appointments/:appointmentId` - Delete appointment (protected)

## Database

Using SQLite (H2 alternative) with Sequelize ORM. Database file is stored at `./data/petcare.db`

For production H2 database integration:
1. Install H2 Server
2. Update database config to use H2 connection string
3. Modify `src/config/database.js` to use H2 dialect

## Features

- User authentication with JWT
- Password hashing with bcryptjs
- Pet profile management
- Appointment scheduling
- Email/phone verification ready
- Error handling
- CORS support

## Authentication

Requests to protected endpoints must include:
```
Authorization: Bearer {token}
```

Token is returned on successful login/registration and is valid for 7 days.
