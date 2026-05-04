# QUICK START GUIDE

## Prerequisites
- Node.js v14+ installed
- npm v6+ installed

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Install Frontend Dependencies

Open a new terminal:
```bash
cd frontend
npm install
```

## Step 3: Start Backend Server

In the backend terminal:
```bash
npm run dev
```

You should see:
```
✓ Server is running on port 5000
✓ Database synchronized
✓ API available at http://localhost:5000
```

## Step 4: Start Frontend Application

In the frontend terminal:
```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
```

## Step 5: Open in Browser

Visit `http://localhost:3000` in your browser

## First Steps in the App

1. **Register**: Click "Register" link and create a new account
2. **Add Pets**: Go to "My Pets" tab and add your pet information
3. **Book Appointments**: Go to "Appointments" tab and schedule a vet appointment
4. **View Profile**: Your profile information is stored securely

## Database

The application uses SQLite database (H2 compatible). Database file is created automatically at:
```
backend/petcare.db
```

To reset the database, delete this file and restart the backend.

## API Endpoints

Test the API directly at:
- Health check: `http://localhost:5000/api/health`
- Full API: `http://localhost:5000/api`

## Stopping the Servers

- Press `Ctrl+C` in each terminal to stop the servers

## Troubleshooting

### Port Already in Use
- Backend port 5000: Change PORT in backend/.env
- Frontend port 3000: Vite will auto-select next available port

### Database Connection Error
1. Ensure backend data directory exists
2. Delete backend/petcare.db and restart

### CORS Errors
- Ensure backend is running on http://localhost:5000
- Check backend .env configuration

## Next Steps

- Customize styling in frontend/src/styles/
- Add more pet types in Pet model
- Implement payment integration
- Add doctor/clinic directory
- Create mobile app

For detailed information, see README.md files in each directory.
