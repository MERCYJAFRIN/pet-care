# 🚀 Quick Start Reference Card

## 📍 Access Points
```
Browser:        http://localhost:3000
Backend API:    http://localhost:5000
```

---

## ✨ Key Features at a Glance

| Feature | Access | Quick Use |
|---------|--------|-----------|
| **My Pets** | Main tab | Add, view, manage all pets |
| **Health Metrics** | Health History → Metrics | Record: weight, temp, heart rate, etc. |
| **Vaccinations** | Health History → Vaccines | Track vaccination dates & next due |
| **Medical History** | Health History → Medical | Log vet visits & treatments |
| **Health Reminders** | Health History → Reminders | Set reminders for care tasks |
| **Weight Tracking** | Health History → Weight | Monitor weight trends over time |
| **Medicine Schedule** | Health History → Medicines | Track medicines & dosages |
| **Health Dashboard** | Health History tab | View overall health summary |

---

## 🎬 Essential Tasks (In Order)

### 1️⃣ First Time Setup
```
1. Go to http://localhost:3000
2. Register or Login
3. Add your first pet (e.g., "rocks")
   → Type: Dog, Color: white, Weight: 6 kg, Age: 8 years
4. ✅ Done! Pet created successfully
```

### 2️⃣ Record Health Data
```
1. Go to Health History → Health Metrics
2. Select your pet
3. Add Metric: weight, temperature, notes
4. ✅ Health record saved
```

### 3️⃣ Track Vaccinations
```
1. Go to Health History → Vaccinations
2. Click "Add Vaccination"
3. Enter: vaccine name, dates, vet info
4. ✅ Vaccination recorded
```

### 4️⃣ Log Medical Visits
```
1. Go to Health History → Medical History
2. Click "Add Medical Record"
3. Enter: visit date, diagnosis, treatment
4. ✅ Record saved
```

### 5️⃣ Set Up Reminders
```
1. Go to Health History → Reminders
2. Click "Add Reminder"
3. Set: title, date, frequency
4. ✅ Reminder created
```

---

## ⌨️ Common Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Console | F12 |
| Refresh Page | Ctrl+F5 |
| Logout | View Profile → Logout |
| View Home | Click App Logo |
| Search (if available) | Ctrl+F |

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Can't add pet** | Check console (F12) → Refresh → Try again |
| **Backend not responding** | Run: `cd backend; npm start` |
| **Frontend won't load** | Run: `cd frontend; npm run dev` |
| **Data not saving** | Logout & login → Clear cache → Try again |
| **Port already in use** | Kill process: See terminal for instructions |
| **Authentication error** | Register new account or reset password |

---

## 📊 Data Organization

```
Your Account
├── Pet 1: rocks (Dog)
│   ├── Health Metrics (10+ records)
│   ├── Vaccinations (2: Rabies, DHPP)
│   ├── Medical History (2+ visits)
│   ├── Reminders (3+)
│   ├── Weight Log (4+ entries)
│   └── Medicines (2+ schedules)
│
└── Pet 2: Fluffy (Cat)
    ├── Health Metrics
    ├── Vaccinations
    ├── Medical History
    ├── [Same structure as Pet 1]
```

---

## 💾 Data Storage

| Data | Storage | Sync | Backup |
|------|---------|------|--------|
| Pets | Database | Automatic | SQLite file |
| Health Metrics | Database | Real-time | Auto-saved |
| Vaccinations | Database | Real-time | Auto-saved |
| Medical Records | Database | Real-time | Auto-saved |
| Login Token | Local Storage | Browser | Auto-managed |

**Note**: All data is stored locally. Your database file: `backend/data/petcare.db`

---

## 🔐 Account Security

```
✅ Account Features:
- Password-protected login
- Unique JWT token per session
- Secure data isolation (only you see your pets)
- No data shared with others
- Local storage of information

⚠️ Remember:
- Don't share your login credentials
- Logout before leaving the computer
- Clear browser cache if sharing computer
- Contact admin if account compromised
```

---

## 📋 Test Data for Quick Testing

**Testing Pet "rocks":**
```
Name:       rocks
Type:       Dog
Breed:      country dog
Age:        8 years
Weight:     6 kg
Color:      white
Vaccinated: Yes
Neutered:   Yes

Test Vaccine: Rabies
Date:       15-02-2026
Next Due:   15-02-2027

Test Metric:
Weight:     6.1 kg
Temp:       38.5°C
Heart Rate: 82 bpm
Activity:   Active
```

---

## 🎯 Success Indicators

### ✅ Pet Addition Works
```
1. Click "Add New Pet"
2. Fill form with "rocks" data
3. Click "Add Pet"
4. ✨ Success message appears
5. Pet shows in list
```

### ✅ Health Metrics Works
```
1. Select pet "rocks"
2. Add metric with weight & temp
3. ✨ Metric appears in history
4. Can view metric details
```

### ✅ Vaccinations Work
```
1. Select pet "rocks"
2. Add Rabies with due date
3. ✨ Vaccination shows in list
4. Next due date displays
```

### ✅ Dashboard Works
```
1. Go to Health Dashboard
2. Select pet "rocks"
3. ✨ Displays:
   - Latest weight: 6.1 kg
   - Vaccinations: 1 recorded
   - Medical records: (if any)
   - Active reminders: (if any)
```

---

## 🛠️ Server Commands Reference

**Start Backend:**
```powershell
cd backend
npm start
→ Listens on http://localhost:5000
```

**Start Frontend:**
```powershell
cd frontend
npm run dev
→ Listens on http://localhost:3000
```

**Stop Servers (Terminal):**
```
Ctrl+C in the running terminal
```

**Check Backend Health:**
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/health
→ Should return: {"status":"Backend is running"...}
```

---

## 📞 Getting Help

**If something doesn't work:**

1. **Check Console:**
   - Press F12
   - Go to Console tab
   - Look for red errors

2. **Check Backend Logs:**
   - Look at terminal running `npm start`
   - Search for error messages

3. **Common Fixes:**
   - Refresh page (Ctrl+F5)
   - Logout and login
   - Restart servers
   - Clear browser cache

4. **Report Issues with:**
   - Screenshot of error
   - Console error message
   - Network request details
   - Backend log output

---

## 📱 Browser Support

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Works great |
| Edge | ✅ Full | Windows recommended |
| Safari | ✅ Full | macOS/iOS |
| Mobile | ✅ Responsive | Touch-optimized |

---

## 🎓 Learning Path

**Beginner (30 mins):**
- Register account
- Add 1 pet
- Add health metric
- View pet profile

**Intermediate (1 hour):**
- Add multiple pets
- Record vaccinations
- Log medical history
- Set reminders

**Advanced (2+ hours):**
- Track weight trends
- Manage medicines
- View analytics
- Use dashboard insights

---

## 📈 Features Roadmap

| Feature | Status | Notes |
|---------|--------|-------|
| Pet Management | ✅ Done | Full CRUD operations |
| Health Metrics | ✅ Done | Vital signs tracking |
| Vaccinations | ✅ Done | Complete tracking |
| Medical History | ✅ Done | Visit logs & treatments |
| Reminders | ✅ Done | Notification system |
| Weight Tracking | ✅ Done | Trend analysis |
| Medicines | ✅ Done | Schedule management |
| Analytics | ✅ Done | Health Dashboard |
| Appointments | ✅ Available | Booking system |

---

## 🎉 You're All Set!

**Ready to start?**

1. ✅ Open http://localhost:3000
2. ✅ Register/Login
3. ✅ Add pet "rocks"
4. ✅ Record health metrics
5. ✅ Manage vaccinations

**Need detailed guidance?**
→ See `STEP_BY_STEP_TESTING_GUIDE.md`

**Want to know more?**
→ See `PET_PROFILE_HEALTH_TRACKING_MODULE.md`

---

**Happy pet care! 🐾**
