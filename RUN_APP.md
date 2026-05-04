# 🐾 Pet Care App - How to Run

## Prerequisites
Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

## Quick Start (2 Steps)

### Step 1: Start the Backend Server
Open a terminal and run:

```bash
cd backend
npm run dev
```

**Expected Output:**
```
✓ Database connection established successfully
✓ Server is running on port 5000
✓ Database synchronized
✓ API available at http://localhost:5000
✓ Notification scheduler initialized with 4 jobs
```

### Step 2: Start the Frontend Server
Open **another terminal** and run:

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in 1208 ms

  ➜  Local:   http://localhost:3001/
```

---

## Access the Application

Open your browser and visit:
```
http://localhost:3001
```

---

## First Time Setup

### 1. Create an Account (Register)
- Click on the registration form
- Fill in your details:
  - First Name
  - Last Name
  - Email
  - Password
  - Phone (optional)
- Click **Register**

### 2. Login
- Enter your email and password
- Click **Login**
- You'll be redirected to the dashboard

### 3. Add Your First Pet
- Click **Add New Pet**
- Fill in pet details:
  - Pet Name (required)
  - Type (Dog, Cat, Bird, Rabbit, Other)
  - Breed
  - Age
  - Weight (kg)
  - Color
  - Vaccinated (checkbox)
  - Neutered (checkbox)
- Click **Add Pet**

---

## Troubleshooting

### Backend won't start
```bash
# Kill any existing Node process
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Try again
npm run dev
```

### Port already in use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the process ID)
taskkill /PID <PID> /F

# Restart
npm run dev
```

### "Failed to fetch pets" error
1. Check browser console (F12 > Console tab)
2. Verify backend is running
3. Check that you're logged in
4. Try adding a pet first - might be empty

### Frontend won't connect to backend
- Make sure backend is running on http://localhost:5000
- Check browser console for CORS errors
- Verify both servers are running in different terminals

---

## Available Features

✅ **User Management**
- Register new account
- Login/Logout
- Profile management

✅ **Pet Management**
- Add/Edit/Delete pets
- Track pet health
- View pet details

✅ **Health Tracking**
- Medical history
- Vaccinations
- Weight loss tracking
- Medicine schedule
- Health metrics
- Health reminders

✅ **Appointments**
- Schedule vet appointments
- Track appointment status
- Payment integration (Razorpay)

✅ **Vacation Management**
- Mark vacation dates
- Track pet care during vacation

---

## Default Test Credentials

If you want to test with an existing account:
```
Email: test@example.com
Password: password123
```

*(These are just suggestions - create your own account on first run)*

---

## File Structure

```
Pet Care 14-02/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── server.js        # Main server file
│   └── package.json
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.jsx          # Root component
│   └── package.json
└── RUN_APP.md              # This file
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| GET | `/api/pets` | Get all user's pets |
| POST | `/api/pets` | Add new pet |
| PUT | `/api/pets/:petId` | Update pet |
| DELETE | `/api/pets/:petId` | Delete pet |
| GET | `/api/appointments` | Get appointments |
| POST | `/api/appointments` | Create appointment |
| GET | `/api/health` | Backend health check |

---

## Need Help?

Check the individual README files:
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`

Happy pet caring! 🐾
