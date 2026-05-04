# 🧪 Step-by-Step Testing Guide - Pet Profile & Health Tracking Module

**Date**: February 27, 2026  
**Status**: Ready to Test  
**Difficulty**: Easy → Intermediate

---

## ✅ Pre-Test Checklist

Before starting, verify:
```
☐ Backend running (npm start in /backend)
☐ Frontend running (npm run dev in /frontend)
☐ Browser open to http://localhost:3000
☐ No compilation errors
☐ You have a valid login or can register
```

---

## 📋 Test Case 1: Registration & Login

### Test 1.1: Register New Account
**Goal**: Create a new user account

**Steps:**
```
1. Go to http://localhost:3000
2. If you see login form:
   → Click "Register" or "Sign Up" link
3. Or if you see registration form already:
   → Proceed to step 4
4. Fill in the registration form:
   - Email: test@example.com (or any email)
   - Password: Test@123 (strong password)
   - Full Name: Test User
   - Phone: 9876543210
5. Click "Sign Up" or "Register"
6. You should be logged in automatically
```

**Expected Result:**
```
✅ Registration successful
✅ Automatically logged in
✅ Redirected to main app (My Pets page)
✅ Your name appears in header
```

**If it fails:**
```
❌ Error message appears
→ Check console (F12) for details
→ Try different email
→ Verify password meets requirements
```

---

### Test 1.2: Login to Existing Account
**Goal**: Login with credentials

**Steps:**
```
1. Go to http://localhost:3000
2. If login page:
   → Email: (use existing email)
   → Password: (use correct password)
   → Click "Login"
3. If already logged in:
   → Logout first (click your name → Logout)
   → Then try login
```

**Expected Result:**
```
✅ Login successful
✅ Token stored in localStorage
✅ Redirected to My Pets page
✅ No errors in console
```

---

## 🐾 Test Case 2: Pet Profile Management

### Test 2.1: Add First Pet (Your Test: "rocks")
**Goal**: Create a new pet profile

**Steps:**
```
1. Make sure you're on "My Pets" tab
2. Look for "Add New Pet" button
3. Click the button
4. Fill in the form with:
   - Name: rocks
   - Type: Dog
   - Breed: country dog
   - Age: 8
   - Weight: 6
   - Color: white
   - Vaccinated: ✓ (check)
   - Neutered: ✓ (check)
5. Click "Add Pet"
6. Wait for success message
```

**Expected Result:**
```
✅ Form submits successfully
✅ Success message appears: "rocks added successfully!"
✅ Pet appears in the list below
✅ Pet card shows all entered information
✅ Console shows no errors
```

**If it fails:**
```
❌ Error message: "Error creating pet"
→ Check backend logs (terminal running npm start)
→ Look for validation errors
→ Verify all required fields filled
→ Check if weight is valid number
→ Ensure network request reaches backend

Debug Steps:
1. Open F12 (developer tools)
2. Go to Network tab
3. Try adding pet again
4. Look for POST request to /api/pets
5. Check response status and error details
```

### Test 2.2: Add Second Pet
**Goal**: Verify multiple pets can be added

**Steps:**
```
1. Click "Add New Pet" again
2. Add a different pet:
   - Name: Fluffy
   - Type: Cat
   - Breed: Persian
   - Age: 3
   - Weight: 4.5
   - Color: Gray
   - Vaccinated: ✓
   - Neutered: ✓
3. Click "Add Pet"
```

**Expected Result:**
```
✅ Second pet added successfully
✅ Both "rocks" and "Fluffy" appear in list
✅ Each pet shows correct information
```

### Test 2.3: View Pet List
**Goal**: Verify all pets display correctly

**Steps:**
```
1. Check the "My Pets" tab
2. Look at the pet cards/list
3. Verify each pet shows:
   - Name
   - Type
   - Breed (if provided)
   - Age
   - Weight
   - Color
   - Vaccination status
   - Neutered status
```

**Expected Result:**
```
✅ All pets display with correct info
✅ Cards/list is well-formatted
✅ Images or icons load (if available)
```

---

## 📊 Test Case 3: Health Metrics Tracking

### Test 3.1: Auto-Created Health Metrics on Pet Addition
**Goal**: Verify health metrics are created when pet added

**Steps:**
```
1. After adding "rocks" with weight=6kg
2. Check if health metric was auto-created:
   - Go to Health History tab
   - Select Health Metrics section
   - Select "rocks" from pet dropdown
   - See if initial metric appears
```

**Expected Result:**
```
✅ Initial health metric appears for rocks
✅ Shows weight: 6 kg
✅ Shows creation date (today)
✅ Can view metric details
```

### Test 3.2: Add Health Metric Manually
**Goal**: Record daily health measurements

**Steps:**
```
1. Go to Health History → Health Metrics
2. Select "rocks" from pet dropdown
3. Click "Add Health Metric" button
4. Fill in the form:
   - Weight: 6.1 (changed slightly)
   - Temperature: 38.5
   - Heart Rate: 82
   - Blood Pressure: 120/80
   - Respiratory Rate: 25
   - Hydration: Normal
   - Appetite: Good
   - Activity: Active
   - Notes: "Healthy and active"
5. Click "Save Metric"
```

**Expected Result:**
```
✅ Metric saves successfully
✅ New metric appears in history
✅ Shows timestamp
✅ Can view metric details
✅ Appears in analytics
```

### Test 3.3: View Health Metrics History
**Goal**: See all recorded metrics for a pet

**Steps:**
```
1. Go to Health History → Health Metrics
2. Select "rocks"
3. Scroll through metrics list
4. Verify each shows:
   - Date/Time
   - Weight
   - Temperature
   - Other measurements
   - Notes
```

**Expected Result:**
```
✅ All metrics display in order (newest first)
✅ Each metric shows complete data
✅ Can sort or filter (if available)
```

---

## 💊 Test Case 4: Vaccination Management

### Test 4.1: Add Vaccination Record
**Goal**: Record vaccinations for a pet

**Steps:**
```
1. Navigate to Vaccination section
   (from Health History or main menu)
2. Select "rocks" if not already selected
3. Click "Add Vaccination"
4. Fill in the form:
   - Vaccine Name: Rabies
   - Vaccination Date: 2026-02-15
   - Next Due Date: 2027-02-15
   - Vet Clinic: Happy Paws Clinic
   - Vet Name: Dr. Sharma
   - Batch Number: RB-2026-001
   - Side Effects: None
   - Notes: "Annual booster shot"
5. Click "Save Vaccination"
```

**Expected Result:**
```
✅ Vaccination saves successfully
✅ Appears in vaccination list
✅ Shows next due date
✅ Displays vet information
✅ Can view vaccination details
```

### Test 4.2: Add Another Vaccination
**Goal**: Verify multiple vaccinations can be tracked

**Steps:**
```
1. Click "Add Vaccination" again
2. Add DHPP vaccine:
   - Name: DHPP
   - Date: 2026-02-20
   - Next Due: 2027-02-20
   - Vet: Dr. Sharma
   - Batch: DHPP-2026-001
3. Save
```

**Expected Result:**
```
✅ Both vaccinations appear
✅ Each shows complete information
✅ Next due dates displayed clearly
```

### Test 4.3: View Vaccination Status
**Goal**: Check if vaccination dashboard shows correct status

**Steps:**
```
1. Look for vaccination status display
2. Verify it shows:
   - Total vaccinations recorded
   - Vaccinations status (up-to-date, upcoming, overdue)
   - Next vaccination due
```

**Expected Result:**
```
✅ Status displays correctly
✅ Shows Rabies and DHPP as recorded
✅ Next due dates accurate
```

---

## 📋 Test Case 5: Medical History

### Test 5.1: Add Medical Record
**Goal**: Log a veterinary visit

**Steps:**
```
1. Go to Medical History section
2. Select "rocks"
3. Click "Add Medical Record"
4. Fill in:
   - Visit Date: 2026-02-24
   - Vet Clinic: Happy Paws Clinic
   - Vet Name: Dr. Sharma
   - Condition: Skin infection
   - Diagnosis: Fungal infection on left paw
   - Treatment: Topical antifungal applied + prescribed lotion
   - Prescription: Antifungal lotion (twice daily for 7 days)
   - Cost: 500
   - Notes: "Monitor for improvement, return in 1 week"
5. Click "Save Record"
```

**Expected Result:**
```
✅ Medical record saves successfully
✅ Appears in medical history list
✅ Shows all recorded information
✅ Displays visit date and vet details
✅ Can view full record
```

### Test 5.2: Add Another Medical Record
**Goal**: Verify multiple medical records can be stored

**Steps:**
```
1. Click "Add Medical Record" again
2. Add older visit:
   - Date: 2026-01-15
   - Clinic: Alpha Vet Care
   - Vet: Dr. Kumar
   - Condition: Annual Check-up
   - Diagnosis: Healthy, no issues found
   - Treatment: Routine examination, teeth cleaning
   - Cost: 1200
3. Save
```

**Expected Result:**
```
✅ Both records appear in history
✅ Ordered by date (newest first)
✅ Each shows complete details
```

---

## ⏰ Test Case 6: Health Reminders

### Test 6.1: Set Vaccination Reminder
**Goal**: Create a reminder for upcoming vaccination

**Steps:**
```
1. Navigate to Health Reminders
2. Select "rocks"
3. Click "Add Reminder"
4. Fill in:
   - Type: Vaccination (if option exists)
   - Title: Rabies Vaccination Due
   - Description: Next rabies booster is due
   - Reminder Date: 2026-12-15
   - Frequency: Yearly
   - Notes: "Annual rabies booster"
5. Click "Save Reminder"
```

**Expected Result:**
```
✅ Reminder created successfully
✅ Appears in reminders list
✅ Shows due date
✅ Frequency set to yearly
```

### Test 6.2: Set Appointment Reminder
**Goal**: Create reminder for vet appointment

**Steps:**
```
1. Click "Add Reminder"
2. Fill in:
   - Type: Appointment
   - Title: Vet Check-up Appointment
   - Description: Monthly health check
   - Date: 2026-03-15
   - Frequency: One-time (or Monthly)
3. Save
```

**Expected Result:**
```
✅ Appointment reminder created
✅ Shows in upcoming reminders
✅ Displays date and description
```

### Test 6.3: View Reminders Status
**Goal**: Check reminder status (upcoming, today, overdue)

**Steps:**
```
1. View all reminders for "rocks"
2. Check color coding:
   - Green = Upcoming
   - Orange/Yellow = Today
   - Red = Overdue
3. Verify dates are accurate
```

**Expected Result:**
```
✅ Reminders display with status colors
✅ Dates match what was entered
✅ Can identify which are due soon
```

---

## ⚖️ Test Case 7: Weight Tracking

### Test 7.1: Add Weight Record
**Goal**: Log pet's weight for trend tracking

**Steps:**
```
1. Navigate to Weight Loss/Weight Tracking section
2. Select "rocks"
3. Click "Add Weight Record"
4. Fill in:
   - Weight: 6.0 kg
   - Date: 2026-02-27
   - Notes: "Baseline weight recorded"
5. Save
```

**Expected Result:**
```
✅ Weight record saves
✅ Appears in weight history
✅ Shows date recorded
```

### Test 7.2: Add Multiple Weight Records
**Goal**: Build weight history for trend analysis

**Steps:**
```
1. Add weight for one week ago:
   - Weight: 5.9 kg
   - Date: 2026-02-20
   - Notes: "Week 1"

2. Add weight for two weeks ago:
   - Weight: 5.8 kg
   - Date: 2026-02-13
   - Notes: "Week 2"

3. Add weight for three weeks ago:
   - Weight: 5.7 kg
   - Date: 2026-02-06
   - Notes: "Starting weight"
```

**Expected Result:**
```
✅ All weights appear in history
✅ Ordered by date
✅ Shows weight change trend: going up (5.7 → 6.0 kg)
```

### Test 7.3: View Weight Trend (if available)
**Goal**: See weight changes visualized

**Steps:**
```
1. Look for weight chart/graph
2. Should show:
   - X-axis: Dates
   - Y-axis: Weight (kg)
   - Line showing weight trend upward
3. Check if trend is accurate
```

**Expected Result:**
```
✅ Chart displays (if implemented)
✅ Shows increasing trend
✅ All data points visible
✅ Dates correctly labeled
```

---

## 💊 Test Case 8: Medicine Schedule

### Test 8.1: Add Medicine Schedule
**Goal**: Track medicines being given to pet

**Steps:**
```
1. Navigate to Medicine Schedule
2. Select "rocks"
3. Click "Add Medicine"
4. Fill in:
   - Medicine Name: Antifungal Lotion
   - Dosage: Apply topically
   - Start Date: 2026-02-24
   - End Date: 2026-03-03 (7 days)
   - Frequency: Twice daily
   - Times: 08:00, 20:00
   - Reason: Fungal skin infection
   - Side Effects: Slight dryness, may cause irritation
   - Notes: "Apply after cleaning affected area"
5. Save
```

**Expected Result:**
```
✅ Medicine schedule saves
✅ Appears in active medicines list
✅ Shows dosage and times
✅ End date is 7 days from start
```

### Test 8.2: Add Another Medicine
**Goal**: Verify multiple medicines can be tracked

**Steps:**
```
1. Add another medicine:
   - Name: Vitamin Supplement
   - Dosage: 1 tablet
   - Start: 2026-02-27
   - End: (leave empty for ongoing)
   - Frequency: Once daily
   - Time: 09:00
   - Reason: Nutritional support
2. Save
```

**Expected Result:**
```
✅ Both medicines appear in list
✅ One shows end date, one shows ongoing
✅ Each shows correct timing
```

### Test 8.3: Mark Dose as Completed
**Goal**: Track which doses have been given

**Steps:**
```
1. Look for active medicines
2. Find Antifungal Lotion medicine
3. Look for dose marked "Due now"
4. Click "Mark as Completed" or similar
5. Verify it marks as done
```

**Expected Result:**
```
✅ Dose marks as completed
✅ Updates medicine schedule
✅ Next dose shows as due
✅ Records completed doses
```

---

## 📈 Test Case 9: Health Dashboard & Analytics

### Test 9.1: View Health Dashboard
**Goal**: See overall health summary

**Steps:**
```
1. Go to Health Dashboard
2. Select "rocks" from pet dropdown
3. Review displayed information:
   - Latest measurements
   - Weight trend
   - Vaccination status
   - Medical history summary
   - Active medicines
   - Upcoming appointments
```

**Expected Result:**
```
✅ Dashboard loads successfully
✅ Shows current health data
✅ Displays trends if enough data exists
✅ Shows vaccination status
✅ Lists active medicines
✅ No missing data (unless not recorded yet)
```

### Test 9.2: Check Vaccination Analytics
**Goal**: View vaccination summary

**Steps:**
```
1. On dashboard:
   - Look for vaccination section
   - Check status (up-to-date, upcoming, overdue)
   - See list of recorded vaccinations
   - Check next due dates
```

**Expected Result:**
```
✅ Shows both Rabies and DHPP vaccinations
✅ Displays next due dates accurately
✅ Status is correct (should be scheduled)
```

### Test 9.3: Check Weight Analytics
**Goal**: View weight trend

**Steps:**
```
1. Look for weight section on dashboard
2. Should show:
   - Latest weight: 6.0 kg
   - Weight trend chart
   - Change over time
   - Any goal (if set)
```

**Expected Result:**
```
✅ Latest weight displays: 6.0 kg
✅ Trend chart shows upward movement
✅ All recorded weights included
```

---

## 🐱 Test Case 10: Multiple Pets Management

### Test 10.1: Switch Between Pets
**Goal**: Verify data isolation between pets

**Steps:**
```
1. You should have "rocks" (Dog) and "Fluffy" (Cat)
2. Select "rocks" from pet dropdown
3. Verify health data shown is for rocks only:
   - Health metrics for rocks
   - Vaccinations for rocks
   - Medical history for rocks
4. Switch to "Fluffy"
5. Verify NO data from rocks appears:
   - Only Fluffy's health metrics
   - Only Fluffy's vaccinations
   - Only Fluffy's medical history
```

**Expected Result:**
```
✅ Selecting rocks shows only rocks' data
✅ Selecting Fluffy shows only Fluffy's data
✅ No data mixing between pets
✅ Pet dropdown works smoothly
```

### Test 10.2: Add Data for Second Pet
**Goal**: Build separate records for Fluffy

**Steps:**
```
1. Select "Fluffy" from dropdown
2. Add health metric:
   - Weight: 4.5 kg
   - Temperature: 38.2
   - Appetite: Good
   - Notes: "Healthy as usual"
3. Add vaccination:
   - Vaccine: FVRCP (feline vaccines)
   - Date: 2026-02-10
   - Next Due: 2027-02-10
4. Add medical record:
   - Date: 2026-02-10
   - Clinic: Happy Paws
   - Diagnosis: Routine check-up
```

**Expected Result:**
```
✅ Fluffy's data saved separately
✅ Doesn't appear when viewing rocks
✅ Dashboard shows Fluffy's specific data
```

---

## 🔍 Test Case 11: Cross-Browser Compatibility

### Test 11.1: Test in Different Browser
**Goal**: Verify app works across browsers

**Steps:**
```
1. Open http://localhost:3000 in:
   - Chrome
   - Firefox
   - Edge
2. Login and verify features work:
   - Can see pets
   - Can add new pet
   - Can view health data
   - Forms work correctly
   - Charts/graphs display
```

**Expected Result:**
```
✅ App works in all major browsers
✅ Layout is responsive
✅ No JavaScript errors
✅ Features functional everywhere
```

---

## 📱 Test Case 12: Mobile Responsiveness

### Test 12.1: Test on Mobile Device
**Goal**: Verify mobile usability

**Steps:**
```
1. Get your phone's IP address
2. On mobile, go to:
   http://<your-computer-ip>:3000
3. Test:
   - Layout adapts to mobile screen
   - Buttons are touch-friendly
   - Forms are easy to fill
   - Can navigate between tabs
   - Data displays correctly
```

**Expected Result:**
```
✅ Mobile layout is responsive
✅ Text is readable
✅ Buttons are easily tappable
✅ No horizontal scrolling needed
✅ All features accessible
```

---

## 📊 Test Summary Template

After completing tests, fill in this summary:

```
Test Date: __________
Tester: __________

REGISTRATION & LOGIN:
  Test 1.1 (Register): ☐ PASS ☐ FAIL ☐ SKIP
  Test 1.2 (Login): ☐ PASS ☐ FAIL ☐ SKIP

PET PROFILE MANAGEMENT:
  Test 2.1 (Add Pet - rocks): ☐ PASS ☐ FAIL ☐ SKIP
  Test 2.2 (Add Second Pet): ☐ PASS ☐ FAIL ☐ SKIP
  Test 2.3 (View Pets): ☐ PASS ☐ FAIL ☐ SKIP

HEALTH METRICS:
  Test 3.1 (Auto-created): ☐ PASS ☐ FAIL ☐ SKIP
  Test 3.2 (Add Manually): ☐ PASS ☐ FAIL ☐ SKIP
  Test 3.3 (View History): ☐ PASS ☐ FAIL ☐ SKIP

VACCINES:
  Test 4.1 (Add Vaccine): ☐ PASS ☐ FAIL ☐ SKIP
  Test 4.2 (Multiple Vaccines): ☐ PASS ☐ FAIL ☐ SKIP
  Test 4.3 (Status Display): ☐ PASS ☐ FAIL ☐ SKIP

MEDICAL HISTORY:
  Test 5.1 (Add Record): ☐ PASS ☐ FAIL ☐ SKIP
  Test 5.2 (Multiple Records): ☐ PASS ☐ FAIL ☐ SKIP

HEALTH REMINDERS:
  Test 6.1 (Vaccination Reminder): ☐ PASS ☐ FAIL ☐ SKIP
  Test 6.2 (Appointment Reminder): ☐ PASS ☐ FAIL ☐ SKIP
  Test 6.3 (Status Display): ☐ PASS ☐ FAIL ☐ SKIP

WEIGHT TRACKING:
  Test 7.1 (Add Weight): ☐ PASS ☐ FAIL ☐ SKIP
  Test 7.2 (Weight History): ☐ PASS ☐ FAIL ☐ SKIP
  Test 7.3 (Weight Trend): ☐ PASS ☐ FAIL ☐ SKIP

MEDICINE SCHEDULE:
  Test 8.1 (Add Medicine): ☐ PASS ☐ FAIL ☐ SKIP
  Test 8.2 (Multiple Medicines): ☐ PASS ☐ FAIL ☐ SKIP
  Test 8.3 (Mark Completed): ☐ PASS ☐ FAIL ☐ SKIP

HEALTH DASHBOARD:
  Test 9.1 (Dashboard Display): ☐ PASS ☐ FAIL ☐ SKIP
  Test 9.2 (Vaccination Analytics): ☐ PASS ☐ FAIL ☐ SKIP
  Test 9.3 (Weight Analytics): ☐ PASS ☐ FAIL ☐ SKIP

MULTIPLE PETS:
  Test 10.1 (Switch Between Pets): ☐ PASS ☐ FAIL ☐ SKIP
  Test 10.2 (Add Pet-Specific Data): ☐ PASS ☐ FAIL ☐ SKIP

CROSS-BROWSER:
  Test 11.1 (Multiple Browsers): ☐ PASS ☐ FAIL ☐ SKIP

MOBILE:
  Test 12.1 (Mobile Responsiveness): ☐ PASS ☐ FAIL ☐ SKIP

ISSUES FOUND:
1. ________________________
2. ________________________
3. ________________________

OVERALL STATUS: ☐ ALL PASS ☐ SOME FAIL ☐ BLOCKING ISSUES

Notes:
_________________________________________________
_________________________________________________
```

---

## 🎯 Success Criteria

**Minimum to Pass:**
- ✅ Can register/login
- ✅ Can add pet "rocks" successfully
- ✅ Can view pet in My Pets list
- ✅ Can add health metrics
- ✅ Can add vaccinations
- ✅ Can view vaccination status

**Nice to Have:**
- ✅ Weight tracking works
- ✅ Medical history records
- ✅ Health reminders set
- ✅ Medicine schedules
- ✅ Dashboard displays analytics

**Bonus:**
- ✅ Works on mobile
- ✅ Multiple pets management
- ✅ Cross-browser compatible
- ✅ Smooth animations
- ✅ Professional UI

---

**Ready to test? Open http://localhost:3000 and start with Test Case 1!**

Good luck! 🚀
