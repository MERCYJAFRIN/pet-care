# Multi-Pet Veterinary Management System - Setup & Integration Guide

## Quick Start Guide

### Prerequisites
- Node.js v14 or higher
- npm v6 or higher
- Git (optional)
- Razorpay account (for payment integration)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration
# Most importantly, add your Razorpay credentials:
# RAZORPAY_KEY_ID=your_key_id
# RAZORPAY_KEY_SECRET=your_key_secret

# Start backend server
npm run dev
```

Backend will be available at: `http://localhost:5000`

### Step 2: Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your frontend config
# Make sure REACT_APP_RAZORPAY_KEY_ID matches your Razorpay key

# Start frontend development server
npm run dev
```

Frontend will be available at: `http://localhost:3000` (or another port shown in terminal)

## Razorpay Integration Steps

### 1. Create Razorpay Account

1. Go to [Razorpay.com](https://razorpay.com)
2. Sign up for a free account
3. Complete email verification
4. Set up your business profile

### 2. Get API Keys

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings → API Keys**
3. You'll see:
   - **Key ID** (Public key - safe for frontend)
   - **Key Secret** (Private key - keep secret, for backend only)

### 3. Configure Backend

Create or update `backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
```

### 4. Configure Frontend

Create or update `frontend/.env`:

```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
```

### 5. Test Payment Flow

1. Create a new appointment
2. Click "Pay Now" button
3. Razorpay checkout will open
4. Use test card: **4111 1111 1111 1111**
   - Expiry: Any future date
   - CVV: Any 3 digits
5. Complete payment
6. Verify payment success

## System Features Breakdown

### 1. Multi-Pet Management

**Create a Pet:**
```
Dashboard → Add New Pet → Fill details:
- Name
- Type (Dog, Cat, Bird, etc.)
- Breed
- Date of Birth
- Gender
- Weight
- Microchip ID (optional)
```

**Switch Between Pets:**
- Use pet selector dropdown in header
- All data updates based on selected pet

### 2. Health Monitoring

**Record Health Metrics:**
```
Pet Dashboard → Health Metrics → Add Record:
- Weight
- Temperature
- Heart Rate
- Appetite
- Activity Level
```

**View Analytics:**
```
Analytics Dashboard → Select time period → View:
- Weight trend (line chart)
- Temperature graph
- Vaccination status (radar chart)
- Medical conditions (bar chart)
```

### 3. Vaccination Management

**Add Vaccination:**
```
Pet Dashboard → Vaccinations → Add New:
- Vaccine name
- Vaccination date
- Next due date
- Veterinarian name
- Notes
```

**Track Status:**
- Completed: Vaccination done
- Pending: Not yet due
- Overdue: Past due date (Alert!)

### 4. Appointment Booking with Payment

**Create Appointment:**
```
Appointments → Book New Appointment:
- Select veterinarian
- Choose date and time
- Add description (optional)
- Default fee: ₹500 (customizable)
```

**Payment Process:**
1. Click "Pay" button on appointment
2. Razorpay checkout opens
3. Select payment method
4. Complete payment
5. Automatic confirmation

**Payment Status:**
- Pending: Awaiting payment
- Initiated: Order created, awaiting checkout
- Completed: Payment successful
- Failed: Payment unsuccessful
- Cancelled: Appointment cancelled

### 5. Medical History

**Add Medical Record:**
```
Medical History → Add Record:
- Condition/Diagnosis
- Visit date
- Treatment description
- Veterinarian
- Notes
- Status
```

### 6. Reminder System

**How Reminders Work:**
- Vaccination reminders: 5 days before due date
- Appointment reminders: 1 day before appointment
- Custom reminders: User-defined

**Notification Channels:**
- In-app notifications (bell icon)
- Dashboard alerts
- Email (future feature)
- SMS (future feature)

## Database Models & Relationships

```
User (Stores user accounts)
  │
  ├─ Pet (Multiple pets per user)
  │   ├─ Appointment (Multiple appointments)
  │   ├─ HealthMetrics (Multiple records)
  │   ├─ Vaccination (Multiple records)
  │   ├─ MedicalHistory (Multiple records)
  │   ├─ HealthReminder (Multiple reminders)
  │   └─ Notification (Multiple notifications)
  │
  └─ VacationDates (User vacation periods)
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Pets
- `POST /api/pets` - Create pet
- `GET /api/pets` - List all pets
- `GET /api/pets/{petId}` - Get pet details
- `PUT /api/pets/{petId}` - Update pet
- `DELETE /api/pets/{petId}` - Delete pet

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - List appointments
- `GET /api/appointments/{id}` - Get appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/status/{appointmentId}` - Check payment status
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/refund` - Refund payment

### Analytics
- `GET /api/pets/{petId}/analytics/weight-trend?days=90` - Weight data
- `GET /api/pets/{petId}/analytics/temperature-trend?days=30` - Temperature data
- `GET /api/pets/{petId}/analytics/vaccination-status` - Vaccine status
- `GET /api/pets/{petId}/analytics/medical-conditions` - Medical conditions
- `GET /api/pets/{petId}/analytics/dashboard` - Full dashboard data

### Vaccinations
- `POST /api/pets/{petId}/vaccinations` - Add vaccination
- `GET /api/pets/{petId}/vaccinations` - List vaccinations
- `PUT /api/pets/{petId}/vaccinations/{id}` - Update vaccination
- `DELETE /api/pets/{petId}/vaccinations/{id}` - Delete vaccination

### Health Reminders
- `POST /api/pets/{petId}/health-reminders` - Create reminder
- `GET /api/pets/{petId}/health-reminders` - List reminders
- `PUT /api/pets/{petId}/health-reminders/{id}` - Update reminder
- `DELETE /api/pets/{petId}/health-reminders/{id}` - Delete reminder

## URL Patterns and Routing

### Backend Routes
```
/api/auth/*                          - Authentication
/api/pets                            - General pet operations
/api/pets/:petId/vaccinations        - Pet vaccinations
/api/pets/:petId/weight-loss         - Weight tracking
/api/pets/:petId/medical-history     - Medical history
/api/pets/:petId/medicine-schedule   - Medication schedules
/api/pets/:petId/health-reminders    - Health reminders
/api/pets/:petId/analytics           - Analytics data
/api/appointments                    - Appointment management
/api/payments                        - Payment processing
/api/vacation-dates                  - Vacation management
```

### Frontend Pages
```
/                   - Dashboard (pet selector + summary)
/login              - Login page
/register           - Registration page
/dashboard          - Main dashboard
/pets               - Pet management
/appointments       - Appointment management
/medications        - Medications
/medical-history    - Medical records
/analytics          - Analytics dashboard
/vaccinations       - Vaccination records
/payments           - Payment history
```

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is available
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Check database permissions
ls -la data/
```

### Frontend Can't Connect to API
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check CORS settings in backend
# Ensure frontend URL is whitelisted

# Clear browser cache
# Try incognito mode
```

### Payment Not Working
```
1. Verify Razorpay keys in .env
2. Check browser console for errors
3. Test with Razorpay test card credentials
4. Verify webhook is configured (if using live mode)
```

### Notifications Not Appearing
```
1. Check if notification scheduler started (logs)
2. Verify database is connected
3. Check reminder dates are in correct format
4. Verify user has appointments/vaccinations
```

### Database File Location
```
Backend SQLite database: backend/data/pet_care_db.db
(Created automatically on first run)
```

## Performance Tips

1. **Database:** SQLite suitable for single-server deployments
   - For scaling, migrate to PostgreSQL

2. **Caching:** Implement Redis for session management
   - Cache frequently accessed pet data

3. **API:** Implement pagination for large datasets
   - Default limit: 20 records per page

4. **Frontend:** 
   - Lazy load components
   - Use React.memo for performance
   - Implement virtual scrolling for large lists

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS for production
- [ ] Keep Razorpay secret key private
- [ ] Implement rate limiting
- [ ] Use environment variables for sensitive data
- [ ] Enable CORS only for known origins
- [ ] Implement input validation
- [ ] Use parameterized queries (Sequelize does this)
- [ ] Keep dependencies updated: `npm audit`
- [ ] Set secure cookies

## Production Deployment

### Backend Deployment (Heroku Example)
```bash
# Initialize git
git init

# Create Procfile
echo "web: node src/server.js" > Procfile

# Deploy to Heroku
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Frontend Deployment (Vercel Example)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Environment Variables in Production
- Set all .env variables in hosting platform
- Use strong, unique secrets
- Rotate secrets periodically
- Use different keys for dev/staging/production

## Monitoring & Logs

### Backend Logs
```bash
# Watch logs in development
npm run dev

# Production (implement logging)
# Could use: winston, pino, or Bunyan
```

### Database Monitoring
```bash
# Check database size
ls -lh backend/data/

# Backup database
cp backend/data/pet_care_db.db backup/
```

## Common Commands

### Backend
```bash
npm run dev          # Start with hot reload
npm start            # Start production server
npm test             # Run tests
npm run lint         # Lint code
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Lint code
```

## Useful Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Sequelize ORM](https://sequelize.org/)
- [Recharts Visualization](https://recharts.org/)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check logs for error messages
4. Create an issue in repository

## Version History

- **v2.0.0** (Current)
  - Multi-pet management
  - Razorpay payment integration
  - Analytics dashboard
  - Notification scheduler
  - Health metrics tracking

## License

ISC License - See LICENSE file for details
