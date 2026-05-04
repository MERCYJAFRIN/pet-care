# Complete Setup Guide - Pet Care Application

## Quick Start

### Step 1: Start the Backend Server
```bash
cd backend
npm start
```
✅ You should see: `✓ Server is running on port 5000`

### Step 2: Start the Frontend Server (in a new terminal)
```bash
cd frontend
npm run dev
```
✅ You should see: `VITE ready in XXX ms` and a localhost URL

### Step 3: Open the Application
- Open the URL shown by Vite (typically http://localhost:3003 or similar)
- Register a new account or login

---

## 🐾 Add Your First Pet

1. **Navigate to "My Pets" tab**
2. **Click "Add New Pet"**
3. **Fill in the form vertically:**
   - Name: e.g., "Max"
   - Type: Select from dropdown
   - Breed: e.g., "Golden Retriever"
   - Age: e.g., 3
   - Weight: e.g., 25 (kg)
   - Color: e.g., "Golden"
   - Date of Birth: Select date
   - Vaccinated: Check if applicable
   - Neutered: Check if applicable
   - Medical Notes: Any notes about pet

4. **Click "Add Pet"** button
5. ✅ You should see a success message!

---

## 📅 Book Your First Appointment

1. **Go to "Appointments" tab**
2. **Click "+ Book Appointment"**
3. **Fill in the appointment form:**
   - **Select Pet**: Choose from dropdown
   - **Doctor Name**: e.g., "Dr. Sharma"
   - **Doctor Phone**: e.g., "+91-9876543210"
   - **Doctor Specialty**: e.g., "General Practice"
   - **Doctor Profile Picture URL**: (optional)
   - **Clinic/Hospital**: e.g., "City Pet Hospital"
   - **Appointment Date**: Select future date
   - **Appointment Time**: e.g., "14:30"
   - **Reason for Visit**: Describe the issue
   - **Additional Notes**: (optional)

4. **Click "Book Appointment"** button
5. ✅ Appointment appears in your list!

---

## 💳 Payment Configuration (Razorpay)

### For Testing Without Real Payments:
Leave Razorpay keys empty in `.env` - the system will show test status.

### To Enable Real Payments:

**File:** `backend/.env`

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### How to Get Razorpay Credentials:
1. Go to https://razorpay.com
2. Sign up for a merchant account
3. Go to Dashboard → Settings → API Keys
4. Copy your Key ID and Secret
5. Paste into `.env` file
6. Restart backend server

### Payment Features Once Enabled:
- **Fee**: ₹500 per appointment (customizable)
- **Payment Status**: Track payment progress
- **Secure Processing**: PCI-DSS compliant
- **Multiple Methods**: Cards, UPI, Wallet, etc.

---

## 📋 Medical Records

### Default Medical Records
When you add a pet, 2 default medical history records are automatically created:
- Recent health checkup (30 days ago)
- Vaccination records (60 days ago)

### Add More Medical Records:
1. Go to any pet's profile
2. Click "Medical History"
3. Click "Add Medical Record"
4. Fill in:
   - Visit Date
   - Vet Clinic Name
   - Vet Name
   - Condition/Issue
   - Diagnosis
   - Treatment
   - Prescription
   - Cost
   - Notes

5. Click "Save"

---

## 🚨 Troubleshooting

### Issue: "Server error. Please try again later."

**Solution 1: Restart Backend**
```bash
# In backend terminal:
Ctrl+C  (to stop)
npm start  (to restart)
```

**Solution 2: Clear Database**
```bash
# Stop both servers
# Delete the database:
Remove-Item -Path "data\petcare.db" -Force
# Delete lock files:
Remove-Item -Path "data\petcare.db-shm" -Force
Remove-Item -Path "data\petcare.db-wal" -Force
# Restart backend
cd backend && npm start
```

**Solution 3: Check Token**
- Log out completely
- Clear browser cache/cookies
- Log in again
- Wait 2-3 seconds before accessing Appointments

### Issue: Appointments Not Showing

**Check:**
1. ✅ Backend server is running (port 5000)
2. ✅ You have added at least one pet
3. ✅ You are logged in
4. ✅ Click "Retry" button on error message

### Issue: Pets Not Displaying After Adding

**Solution:**
1. Refresh the page (F5)
2. Click the "Retry" button on Pets tab
3. Check browser console for errors (F12)

### Issue: Backend Won't Start

**Check:**
```bash
# Verify Node.js installed:
node --version

# Verify npm installed:
npm --version

# Check if port 5000 is in use:
netstat -ano | findstr :5000

# Kill process on port 5000 if needed:
taskkill /PID <PID> /F
```

---

## 🔧 Port Configuration

### If Ports Are In Use:

**Frontend (Default: 3003)**
- Edit: `frontend/vite.config.js`
- Change: `port: 3004` (or any free port)

**Backend (Default: 5000)**
- Edit: `backend/.env`
- Change: `PORT=5001` (or any free port)
- Also update `frontend/src/services/api.js`:
  ```javascript
  const API_BASE_URL = 'http://localhost:5001/api';
  ```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Pets
- `GET /api/pets` - Get all pets
- `POST /api/pets` - Create new pet
- `GET /api/pets/:petId` - Get specific pet
- `PUT /api/pets/:petId` - Update pet
- `DELETE /api/pets/:petId` - Delete pet

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:appointmentId` - Update appointment
- `DELETE /api/appointments/:appointmentId` - Delete appointment

### Medical History
- `GET /api/pets/:petId/medical-history` - Get medical records
- `POST /api/pets/:petId/medical-history` - Add medical record
- `PUT /api/pets/:petId/medical-history/:recordId` - Update record
- `DELETE /api/pets/:petId/medical-history/:recordId` - Delete record

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history

---

## 🎯 Step-by-Step Verification

### After Starting Backend:
```bash
npm start
```
✅ Should show:
- Database connection established
- All tables synchronized
- Server running on port 5000

### After Starting Frontend:
```bash
npm run dev
```
✅ Should show:
- VITE ready
- Network URL available
- Local URL (probably http://localhost:3003)

### After Opening Browser:
1. ✅ Page loads without errors
2. ✅ Can register/login
3. ✅ Can navigate to Pets tab
4. ✅ Can add a pet
5. ✅ Can go to Appointments tab
6. ✅ Can book an appointment

---

## 📊 Appointment Workflow

```
1. Login/Register
   ↓
2. Add Pet (creates pet + 2 default medical records)
   ↓
3. Go to Appointments
   ↓
4. Click "Book Appointment"
   ↓
5. Fill in appointment details
   ↓
6. Select payment method when ready
   ↓
7. Complete payment (if Razorpay enabled)
   ↓
8. Appointment confirmed ✅
```

---

## 💡 Features Explained

### Vertical Form Layout
- All form fields stack vertically
- Better mobile experience
- Easier to fill on all devices

### Doctor Profile Cards
- Shows doctor information beautifully
- Includes profile picture
- Displays contact and specialty
- Animated with smooth transitions

### Payment Integration
- Multiple payment options
- Real-time status tracking
- Secure Razorpay processing
- Color-coded status badges

### Email Notifications
- Appointment confirmation emails
- Appointment reminders (1 day before)
- Payment receipts
- Medical alerts

---

## 🔐 Security Notes

✅ **Passwords**: Encrypted with bcrypt
✅ **API Tokens**: JWT based, 24-hour expiry
✅ **Payments**: PCI-DSS compliant via Razorpay
✅ **Database**: SQLite with proper indexing
✅ **CORS**: Configured for security

---

## 📞 Support

**For Database Issues:**
- Delete database files (petcare.db*)
- Restart backend

**For Authentication Issues:**
- Clear browser storage
- Log out and login again

**For API Issues:**
- Check backend console for errors
- Verify port 5000 is accessible
- Check network tab in browser DevTools (F12)

**For Payment Issues:**
- Verify Razorpay keys in .env
- Check API Key format
- Test in Razorpay sandbox first

---

**Status**: ✅ System Ready
**Last Updated**: February 25, 2026
**Version**: 1.0

Application is now set up and ready to use!
