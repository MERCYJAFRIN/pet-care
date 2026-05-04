# Pet Care App - Frontend

React frontend for the Pet Care App using Vite build tool.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx            # Login form component
│   │   ├── Register.jsx         # Registration form component
│   │   ├── PetsList.jsx         # Pets listing and management
│   │   └── AppointmentsList.jsx # Appointments management
│   ├── pages/
│   │   ├── AuthPage.jsx         # Authentication page
│   │   └── Dashboard.jsx        # Main dashboard
│   ├── services/
│   │   ├── api.js               # Axios instance
│   │   └── authService.js       # API service methods
│   ├── styles/
│   │   ├── app.css              # App styles
│   │   ├── auth.css             # Auth component styles
│   │   ├── dashboard.css        # Dashboard styles
│   │   ├── pets.css             # Pets component styles
│   │   ├── appointments.css     # Appointments styles
│   │   └── index.css            # Global styles
│   ├── App.jsx                  # Root component
│   └── main.jsx                 # Entry point
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

## Installation

```bash
cd frontend
npm install
```

## Running the Frontend

### Development Mode
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Features

- User authentication (Login/Register)
- Pet management (Add, View, Edit, Delete)
- Appointment booking and tracking
- Responsive design
- Modern UI with CSS Grid and Flexbox
- JWT token handling
- Protected routes

## API Configuration

The frontend connects to the backend API at `http://localhost:5000/api`

Update the API_BASE_URL in `src/services/api.js` if your backend is hosted elsewhere.

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. All subsequent requests include token in Authorization header
5. On logout, token and user data are cleared from localStorage

## Components

### AuthPage
Handles user login and registration with form validation.

### Dashboard
Main application interface with tab navigation between different sections.

### PetsList
Displays user's pets and allows adding/editing/deleting pets.

### AppointmentsList
Shows scheduled appointments and allows booking new appointments.

## Environment

Make sure your backend is running on `http://localhost:5000` before starting the frontend.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
