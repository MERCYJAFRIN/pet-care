# "No token provided" - Complete Troubleshooting Guide

**Issue:** You see "No token provided" error when trying to access Pets page  
**Date:** February 25, 2026  
**Status:** Fixable - Follow the steps below

---

## Quick Fix (Try This First)

```bash
# Step 1: Stop both servers
# Press Ctrl+C in both terminals

# Step 2: Clear browser data
# Press Ctrl+Shift+Delete in browser
# Check: Cookies and other site data
# Check: Cached files
# Delete

# Step 3: Restart servers
# Terminal 1 (Backend):
cd backend
npm run dev

# Terminal 2 (Frontend):
cd frontend  
npm run dev

# Step 4: Hard refresh browser
# Press Ctrl+Shift+R (not just F5)

# Step 5: Login again
# Go to http://localhost:3001
# Register or login with your credentials
```

**Did it work?** If yes, you're done! ✅

---

## If Quick Fix Didn't Work - Diagnosis

### Step 1: Check Backend Logs

Look at your Terminal 1 (Backend) for errors:
```
✅ Good signs:
- "Backend running on http://localhost:5000"
- "Database connected"
- "NotificationScheduler started"

❌ Bad signs:
- "Cannot find module"
- "Port 5000 already in use"
- Database errors
```

**If you see errors, fix them first before continuing.**

---

### Step 2: Verify API Connection

Open browser console (F12) and run:

```javascript
// Test 1: Check if backend is reachable
fetch('http://localhost:5000/api/auth/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend is UP:', d))
  .catch(e => console.log('❌ Backend is DOWN:', e));

// Test 2: Check localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
console.log('All storage keys:', Object.keys(localStorage));
```

**Expected output:**
```
✅ Backend is UP: { message: 'Health check OK' }
Token: eyJhbGciOi... (long string)
User: {"id":"...","email":"...",...}
```

---

### Step 3: Run Full Diagnostics

If basic checks passed, run detailed diagnostics:

```javascript
// In browser console, paste this:

const diagnose = () => {
  console.log('=== AUTHENTICATION DIAGNOSTICS ===\n');
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('📦 Token Status:');
  console.log('  Exists:', !!token);
  console.log('  Length:', token ? token.length : 0);
  console.log('  Preview:', token ? token.substring(0, 30) + '...' : 'NONE');
  
  console.log('\n👤 User Status:');
  console.log('  Exists:', !!user);
  console.log('  Data:', user ? JSON.parse(user) : 'NONE');
  
  console.log('\n💾 LocalStorage Contents:');
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      console.log('  ' + key + ':', localStorage.getItem(key).substring(0, 50));
    }
  }
  
  console.log('\n🔍 API Configuration:');
  fetch('http://localhost:5000/api/pets', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(r => {
    console.log('  Status:', r.status);
    console.log('  Status Text:', r.statusText);
    return r.json();
  })
  .then(d => console.log('  Response:', d))
  .catch(e => console.log('  Error:', e.message));
};

diagnose();
```

---

## Common Issues & Fixes

### Issue 1: "No token" in localStorage

**Symptom:** 
```
Token exists: false
User exists: false
```

**Solution:**
1. Go back to login page
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try logging in again
4. Check browser console for login errors

---

### Issue 2: Token exists but still getting "No token provided" error

**Symptom:**
```
Token exists: true
Length: 200+
But still getting "No token provided" error
```

**Solution:**

The token is there but not being sent with the request. This is likely a CORS issue:

**A) Check API Base URL:**
```javascript
// In browser console:
console.log('API_BASE_URL should be: http://localhost:5000/api');
```

**B) Check in frontend/src/services/api.js:**
```javascript
// Line 3 should have:
const API_BASE_URL = 'http://localhost:5000/api';
// NOT http://localhost:5000 (missing /api)
```

**C) Verify header is being added:**
```javascript
// Open DevTools → Network tab
// Make a request to /pets
// Look for "Authorization" header
// Should show: Bearer eyJhbGci...
```

If header is missing, restart frontend:
```bash
cd frontend
npm run dev
```

---

### Issue 3: Backend can't find JWT_SECRET

**Symptom:**
```
Backend error: jwt.verify called without algorithm
Error in logs about JWT
```

**Solution:**

1. Check `.env` file exists:
```bash
ls -la backend/.env
# Should show the file exists
```

2. Check JWT_SECRET is set:
```bash
cat backend/.env | grep JWT_SECRET
# Should output: JWT_SECRET=your_secret_key_change_this_in_production
```

3. If missing, add it:
```bash
# Add this line to backend/.env:
JWT_SECRET=your_secret_key_change_this_in_production
```

4. Restart backend:
```bash
npm run dev
```

---

### Issue 4: Token expired

**Symptom:**
```
Token exists: true
But getting 401 "Invalid token" error
```

**Solution:**

Tokens expire after 7 days. Just logout and login again:
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

---

## Advanced Troubleshooting

### Option 1: Check Database Connection

```bash
# Verify database file exists:
ls -la backend/data/database.sqlite

# If not, backend will create it on first run
# Restart backend:
npm run dev
```

### Option 2: Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Try to load Pets
4. Look for `/api/pets` request
5. Click on it
6. Check "Request Headers" section
7. Look for `Authorization: Bearer ...`

**If Authorization header is missing:**
- Restart frontend
- Hard refresh browser (Ctrl+Shift+R)

---

### Option 3: Enable Backend Debug Logging

Edit `backend/src/server.js` and add:

```javascript
// Add after express.json() middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('  Headers:', req.headers);
  next();
});
```

Then restart backend and watch the logs.

---

## Nuclear Option: Complete Reset

**Only do this if nothing else works:**

```bash
# Step 1: Clear everything
cd backend
rm -rf node_modules
rm -f data/database.sqlite
npm install

cd ../frontend
rm -rf node_modules
npm install

# Step 2: Clear browser cache completely
# Ctrl+Shift+Delete
# Delete ALL cached data

# Step 3: Restart servers
cd ../backend
npm run dev
# (in new terminal)
cd frontend
npm run dev

# Step 4: Hard refresh browser
# Ctrl+Shift+R
```

---

## Testing Checklist

After fixing, verify:

- [ ] Backend logs show "Database connected"
- [ ] Backend logs show "NotificationScheduler started"  
- [ ] Frontend loads at http://localhost:3001
- [ ] Can login with valid credentials
- [ ] Lands on Dashboard page (NOT login page)
- [ ] Can see "Welcome, [Name]!" message
- [ ] Can click "My Pets" tab
- [ ] Page shows either pets list OR "Add New Pet" button
- [ ] No "No token provided" error anywhere
- [ ] Browser console shows no 401/403 errors
- [ ] Network tab shows `/api/pets` request has Authorization header

---

## Still Stuck?

Try these resources:

1. **Check API Response:**
```javascript
// Run this in browser console after login:
fetch('http://localhost:5000/api/pets', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(d => console.log(d));
```

2. **Check Backend Logs:**
```bash
# Look for actual error messages when you try to fetch pets
# Should help identify the real issue
```

3. **Verify Environment:**
```bash
node --version  # Should be v14+
npm --version   # Should be v6+
cd backend && npm list # Check dependencies installed
```

4. **Check Port Conflicts:**
```bash
# Windows:
Get-NetTCPConnection -LocalPort 5000
Get-NetTCPConnection -LocalPort 3001

# Mac/Linux:
lsof -i :5000
lsof -i :3001

# If something is using these ports, either:
# - Use different ports
# - Kill the process using the port
```

---

## Success Indicators

**After fixing, you should see:**

✅ Pets page loads  
✅ "No pets yet. Add your first pet!" message OR list of pets  
✅ "Add New Pet" button is clickable  
✅ No error messages  
✅ Console shows no 401/403/500 errors  
✅ Network requests show 200/201 status codes  

---

## Document History

| Date | Status | Notes |
|------|--------|-------|
| Feb 25, 2026 | Created | Initial troubleshooting guide for "No token" issue |

---

## Quick Reference Commands

```bash
# Clear cache and restart everything
cd backend && npm run dev &
cd frontend && npm run dev

# Full reset
rm -rf backend/node_modules frontend/node_modules
npm install --prefix backend
npm install --prefix frontend
npm run dev --prefix backend & npm run dev --prefix frontend

# Check ports
netstat -ano | findstr :5000 (Windows)
lsof -i :5000 (Mac/Linux)

# Kill port (Windows)
Stop-Process -Id <PID> -Force
```

---

**Last Updated:** February 25, 2026  
**Status:** Troubleshooting Guide Complete
