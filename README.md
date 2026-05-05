# Pet Care App - Full Stack Application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMERCYJAFRIN%2Fpet-care&root-directory=frontend)

A comprehensive pet care management application built with React, Node.js/Express, and H2 database.

## Overview

The Pet Care App provides pet owners with an integrated platform to:
- Manage pet profiles with health information
- Schedule appointments with veterinarians
- Track pet vaccination and health records
- Store important pet details (microchip, breed, medical notes)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Project Structure

```
Pet Care 14-02/
├── backend/              # Node.js/Express backend
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── README.md
├── frontend/             # React frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
└── README.md
```

## Quick Start

### 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Start Frontend Application

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## Features

### User Management
- User registration with email verification ready
- Secure login with JWT authentication
- Profile management
- Password hashing with bcryptjs

### Pet Management
- Create and manage multiple pets
- Store pet details (type, breed, age, weight, etc.)
- Track vaccination status
- Medical notes and health information
- Pet microchip tracking

### Appointment System
- Schedule veterinary appointments
- View upcoming appointments
- Appointment status tracking (scheduled, completed, cancelled)
- Add notes to appointments

## Technology Stack

### Frontend
- React 18
- Vite (build tool)
- Axios (HTTP client)
- CSS3 (responsive design)

### Backend
- Node.js
- Express.js
- Sequelize (ORM)
- SQLite/H2 (Database)
- JWT (Authentication)
- bcryptjs (Password hashing)

### Database
- SQLite with Sequelize ORM
- Ready for H2 database migration

## Database Models

### Users
- Email, password, name, contact info
- Profile pictures support
- Email verification status

### Pets
- User reference
- Type (dog, cat, bird, rabbit, other)
- Health information (vaccinated, neutered)
- Medical notes
- Microchip ID

### Appointments
- Pet and user references
- Veterinarian information
- Date/time scheduling
- Status tracking
- Clinical notes

## API Documentation

See [Backend README](backend/README.md) for complete API documentation.

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_change_this_in_production
H2_URL=http://localhost:8082
H2_DB_PATH=./data/petcare
```

### Frontend
Configure API URL in `src/services/api.js`

## Authentication

The app uses JWT (JSON Web Tokens) for authentication:
1. Users register or login
2. Server returns a JWT token
3. Token is stored in browser's localStorage
4. All protected requests include the token

## Database Migration to H2

To use H2 database in production:

1. Install H2 Server
2. Update `backend/src/config/database.js`:
   ```javascript
   const sequelize = new Sequelize({
     dialect: 'h2',
     host: process.env.H2_URL,
     // H2 configuration
   });
   ```
3. Update `.env` with H2 connection details

## Development

### Running in Development Mode
- Backend: `npm run dev` (with hot reload via nodemon)
- Frontend: `npm run dev` (with hot reload via Vite)

### Building for Production
- Frontend: `npm run build`

## Error Handling

The application includes:
- Input validation
- Error messages display
- Network error handling
- JWT token expiration handling

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS protection
- Request validation
- Protected API endpoints

## Future Enhancements

- Email notifications for appointments
- SMS reminders for vaccinations
- Pet marketplace integration
- Veterinarian directory
- Health insurance integration
- Mobile app version
- Real-time notifications
- Payment gateway integration

## Troubleshooting

### Backend won't start
- Ensure port 5000 is available
- Check Node.js version: `node --version`
- Install dependencies: `npm install`

### Frontend connection errors
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Clear browser cache if needed

### Database errors
- Check database file permissions
- Ensure data directory exists
- Delete database file to reset: `rm backend/petcare.db`

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check the individual README files in backend and frontend directories.
