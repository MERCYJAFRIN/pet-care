# Week 3-4: Health Tracking Module - Getting Started Guide

**Quick Setup & First Run Guide**  
**Updated:** February 25, 2026

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- npm v6+ (comes with Node.js)
- Git (optional, for cloning)
- Text editor or VS Code

### Step 1: Start Backend (Terminal 1)
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start server
npm run dev
```

**Expected output:**
```
Backend running on http://localhost:5000
Database initialized at data/database.sqlite
NotificationScheduler started
```

**✅ If you see "Database connected" - Backend is ready!**

---

### Step 2: Start Frontend (Terminal 2)
```bash
# Open new terminal window

# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Expected output:**
```
VITE v... ready in XXX ms
➜  Local:   http://localhost:3001
```

**✅ Frontend is ready!**

---

### Step 3: Access the Application
```
Open browser: http://localhost:3001
```

---

## 📝 First Time Setup

### Step 1: Register Account
1. Click "Register" button
2. Enter:
   - Email: `test@example.com`
   - Password: `Test123!` (minimum 6 chars)
   - Confirm Password
3. Click "Register"
4. You're automatically logged in!

### Step 2: Add Your First Pet
1. Click "Dashboard" (you're here by default)
2. Click "My Pets" section (or tab)
3. Click "Add New Pet" button
4. Fill in:
   - **Name:** Max (or your pet's name)
   - **Type:** Dog (or other type)
   - **Breed:** Golden Retriever
   - **Age:** 3
   - **Weight:** 30 kg
   - **Color:** Golden
   - **Vaccinated:** Check the box
   - **Neutered:** Check the box
5. Click "Add Pet"
6. ✅ Your first pet is created!

---

## 🏥 Explore Features

### Feature 1: Medical History
```
1. Go to Dashboard → Health History → Medical History tab
2. Click "Add Medical Record"
3. Enter:
   - Condition: "Hip Dysplasia" (sample)
   - Description: "Hereditary condition"
   - Severity: Moderate
   - Treatment: "Pain management"
4. Click Save
5. View your medical record in the list!
```

**What you'll see:**
- Condition name with color-coded severity badge
- Description and treatment info
- Date recorded
- Edit/Delete buttons

---

### Feature 2: Vaccination Management
```
1. Go to Vaccinations Management
2. Click "Add Vaccination"
3. Enter:
   - Vaccine: "Rabies"
   - Date: Today's date
   - Veterinarian: "Dr. Smith"
   - Status: "Completed"
4. Click Save
5. Add more vaccines (DHPP, Bordetella, etc.)
```

**What you'll see:**
- List of all vaccinations
- Status badges (Completed, Pending, Overdue)
- Next due date
- Veterinarian name
- Edit/Delete options

---

### Feature 3: Health Reminders
```
1. Go to Health Reminders section
2. Click "Add Reminder"
3. Enter:
   - Type: "Veterinary Checkup"
   - Date: 7 days from today
   - Time: 10:00 AM
   - Recurring: Once
   - Notes: "Annual checkup"
4. Click Save
```

**What you'll see:**
- Upcoming reminders list
- Countdown to reminder date
- Different icons for reminder types
- Mark completed option

---

### Feature 4: Weight Tracking
```
1. Go to Weight Loss Tracking
2. Click "Add Weight Record"
3. Enter:
   - Weight: 30.5 kg
   - Date: Today
   - Notes: (optional)
4. Click Save
5. Add weights for past dates (to see trend)
```

**What you'll see:**
- Weight history list
- Weight records
- Add multiple entries over time

---

### Feature 5: Analytics Dashboard
```
1. Go to Analytics Dashboard
2. View charts:
   - Weight Trend (30/90/180 day filter)
   - Temperature Trend
   - Vaccination Status
   - Medical Conditions
   - Dashboard Summary
```

**What you'll see:**
- **Weight Chart:** Line graph of weight over time
- **Temperature:** Temperature trends with normal range
- **Vaccination Radar:** Shows completed/pending/overdue counts
- **Conditions Bar Chart:** Most common conditions
- **Summary Stats:** Key metrics

**To see charts populate:**
- Add 3+ weight records with different dates
- Add 3+ temperature readings
- Add 3+ vaccinations

---

### Feature 6: Medicine Schedule
```
1. Go to Medicine Schedule
2. Click "Add Medicine"
3. Enter:
   - Medicine: "Amoxicillin"
   - Dosage: "500mg"
   - Frequency: "Twice Daily"
   - Start Date: Today
   - End Date: 14 days from today
   - Condition: (select from dropdown)
4. Click Save
```

**What you'll see:**
- Active medicines list
- Dosage and frequency
- Days remaining counter
- "Mark as Given" tracking

---

## 📊 Sample Data Entry Workflow

### Complete Scenario (15 minutes)

**Goal:** Enter enough data to see analytics populate

#### 1. Add Pet
- Name: "Max"
- Type: "Dog"
- Breed: "Golden Retriever"
- Age: "3"
- Weight: "30"

#### 2. Add Medical Records
```
Record 1:
- Condition: "Hip Dysplasia"
- Severity: "Moderate"

Record 2:
- Condition: "Ear Infection"
- Severity: "Mild"

Record 3:
- Condition: "Anxiety"
- Severity: "Mild"
```

#### 3. Add Vaccinations
```
Vaccine 1: Rabies (Completed)
Vaccine 2: DHPP (Completed)
Vaccine 3: Bordetella (Pending, due in 30 days)
```

#### 4. Add Weight Records (for chart)
```
Today:         30.0 kg
1 week ago:    30.5 kg
2 weeks ago:   31.0 kg
3 weeks ago:   31.5 kg
4 weeks ago:   32.0 kg
```

#### 5. Add Reminders
```
Reminder 1: Vet checkup in 7 days
Reminder 2: Vaccination due in 30 days
Reminder 3: Medication refill in 14 days
```

#### 6. Add Medicine
```
Medicine: Amoxicillin
Dosage: 500mg
Frequency: Twice daily
Duration: 14 days
```

#### 7. View Analytics
- Go to Analytics Dashboard
- See populated charts!

---

## 🎨 UI Navigation Guide

### Main Dashboard Layout
```
┌─────────────────────────────────────┐
│  Logo    |  User Menu  |  Logout    │ (Top bar)
├─────────────────────────────────────┤
│ ☐ Pets  ☐ Health    ☐ Analytics    │ (Tab navigation)
│         ☐ Appoint.  ☐ Settings     │
├─────────────────────────────────────┤
│  [Pet Selector Dropdown: Max ▼]     │ (Any page)
├─────────────────────────────────────┤
│                                     │
│   Content Area (Changes by tab)     │
│                                     │
│   - Pets List Component             │
│   - Health History Tabs             │
│   - Analytics Charts                │
│                                     │
├─────────────────────────────────────┤
│  Footer with version info           │
└─────────────────────────────────────┘
```

### Tab Structure in Health History
```
Health History Dashboard
├── Overview
│   ├── Quick stats
│   ├── Recent entries
│   └── Health score
├── Medical History
│   ├── All medical records
│   ├── Timeline view
│   └── Add/Edit buttons
├── Vaccinations
│   ├── All vaccinations
│   ├── Status badges
│   └── Calendar view
├── Medicines
│   ├── Active medicines
│   ├── Dosage info
│   └── Adherence tracking
└── Weight Tracking
    ├── Weight records
    ├── Trend line
    └── Statistics
```

---

## ⚙️ Common Tasks

### Task: Add Medical Record
1. Dashboard → Health History → Medical History tab
2. Click "Add Medical Record"
3. Fill form (all fields required)
4. Click "Save"
5. ✅ Record appears in list

### Task: Track Vaccination
1. Dashboard → Vacinations Management
2. Click "Add Vaccination"
3. Enter vaccine details
4. Click "Save"
5. ✅ Vaccination appears with status

### Task: View Weight Trend
1. Go to Analytics Dashboard
2. Look for "Weight Trend" line chart
3. Hover over points to see values
4. Use time filter buttons (30/90/180 days)
5. See min/max/average statistics

### Task: Check Upcoming Reminders
1. Go to Health Reminders
2. View "Upcoming Reminders" section
3. See countdown to each reminder
4. Mark as complete when done
5. Completed reminders move to history

### Task: Export Data
1. Go to relevant module
2. Look for "Export" button
3. Choose format (CSV/JSON/PDF)
4. Click download
5. ✅ File downloads

---

## 🧪 Quick Testing

### Test Checklist (10 minutes)
- [ ] Add pet - data appears immediately
- [ ] Add medical record - appears in list
- [ ] Add vaccination - status shows correctly
- [ ] Add reminder - appears in upcoming list
- [ ] Switch pets - all data updates
- [ ] View analytics - charts appear (if data added)
- [ ] Refresh page - data persists
- [ ] Add another user - no data crossover

### Test Data Scenarios

**Scenario 1: New User**
- Register
- Add pet
- Add one medical record
- Verify displays correctly

**Scenario 2: Multi-Pet**
- Add 3 different pets
- Add different data for each
- Verify pet selector works
- Verify no data crossover

**Scenario 3: Analytics**
- Add 5+ weight records
- Go to analytics
- See weight chart displaying
- Change time filter
- See chart update

---

## 🔍 Troubleshooting First Run

### Issue: "Cannot GET /api/pets"
**Solution:**
1. Make sure backend is running (`npm run dev` in backend folder)
2. Check it shows: "Backend running on http://localhost:5000"
3. Refresh frontend page

### Issue: Blank page in frontend
**Solution:**
1. Check browser console (F12)
2. Check if backend is running
3. Try hard refresh (Ctrl+Shift+Delete)
4. Clear browser cache

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Option 1: Kill process on port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id <PID> -Force

# Option 2: Use different port (edit backend/src/server.js)
const PORT = 5001;
```

### Issue: Cannot login
**Solution:**
1. Verify you registered first
2. Check email and password are correct
3. Check browser console for errors
4. Verify backend is responding

### Issue: Data not saving
**Solution:**
1. Check backend logs for errors
2. Verify backend is running
3. Check browser network tab (F12)
4. Look for error responses

---

## 📱 Mobile & Browser Testing

### Test on Different Devices

**Desktop (1920x1080)**
- Launch normally
- Verify full layout displays
- Check desktop-optimized UI

**Tablet (768x1024)**
- Resize browser to 768px
- Verify layout adapts
- Check 2-column grids work
- Test touch interactions

**Mobile (375x667)**
- Resize to mobile size
- Verify single column
- Check buttons are clickable
- Test hamburger menu (if any)

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Edge (latest)

---

## 🎯 Next Steps After Setup

1. **Explore Features:** Try each module mentioned above
2. **Add Sample Data:** Follow data entry workflow
3. **View Analytics:** See charts populate
4. **Review Documentation:** Check guides in project folder
5. **Test Mobile:** Resize and test responsiveness
6. **Check Permissions:** Verify data isolation (multiple users)

---

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| README.md | Project overview |
| MULTI_PET_SYSTEM_GUIDE.md | Architecture & features |
| HEALTH_HISTORY_GUIDE.md | Health tracking features |
| WEEK_3-4_VERIFICATION_GUIDE.md | Testing checklist |
| DEVELOPER_QUICK_REFERENCE.md | Code reference for devs |
| API_DOCUMENTATION.md | API endpoints |
| TROUBLESHOOTING.md | Common issues & solutions |

---

## 💡 Tips & Tricks

### Tip 1: Add Historical Data
- Backdate weight entries to see trends
- Add past medical diagnoses
- Add past vaccinations
- This populates analytics charts

### Tip 2: Use Realistic Data
- Use pet's actual info
- Add realistic medical history
- Use actual vaccination records
- Better for testing and demos

### Tip 3: Pet Selection
- Pet selector is global
- Affects all modules
- Change pet anywhere, affects all tabs
- Perfect for multi-pet owners

### Tip 4: Reminders
- Set future dates to test
- Set past dates to test archived reminders
- Use different frequencies to test

### Tip 5: Export Data
- Some features support JSON export
- Useful for backup
- CSV useful for spreadsheets

---

## 🚀 Deployment (When Ready)

### Before Deploying
1. ✅ Complete testing
2. ✅ Review all data
3. ✅ Backup database
4. ✅ Set environment variables
5. ✅ Configure production database

### Deployment Commands
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
npm run production

# Or use PM2 for process management
npm install -g pm2
pm2 start src/server.js
```

For detailed deployment instructions, see `DEPLOYMENT.md`

---

## 📞 Need Help?

1. **Check Troubleshooting.md** for common issues
2. **Review relevant documentation** for features
3. **Check browser console** (F12) for errors
4. **Check backend logs** for API errors
5. **Create detailed bug report** if needed

---

## ✅ Sign-Off Checklist

- [ ] Backend running successfully
- [ ] Frontend accessible at http://localhost:3001
- [ ] Can register and login
- [ ] Can add pets
- [ ] Can add medical records
- [ ] Can add vaccinations
- [ ] Can create reminders
- [ ] Can view analytics
- [ ] Responsive on mobile device

**Once all checked:** System is ready to use! 🎉

---

**Getting Started Guide v1.0**  
**Created:** February 25, 2026  
**Status:** ✅ Ready for First Run
