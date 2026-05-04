# Error Creating Pet - Troubleshooting Guide

## 🔴 Issue: "Error creating pet" message

When you try to add a pet named "rocks", you get an error message. This guide helps you debug it.

---

## ⚡ Quick Fixes (Try These First)

### 1. **Logout and Login Again**
The most common cause is an expired or invalid authentication token.

```
1. Click on your profile/logout button
2. Click "Logout"
3. Go back to login page
4. Login again
5. Try to add the pet again
```

**Why**: Your session token might have expired.

---

### 2. **Hard Refresh Browser**
Sometimes the old token is cached.

```
Windows: Ctrl + Shift + Delete (or Ctrl + F5)
Mac: Command + Shift + R
```

Then login again and try adding the pet.

---

### 3. **Check Your Input Data**
The pet form might have validation issues. Verify:

```
✓ Pet Name: "rocks" (cannot be empty)
✓ Pet Type: Should be from dropdown (dog, cat, bird, etc.)
✓ Weight: Should be a number (you have 6)
✓ Age: Should be a number (you have 8)
```

The type field must match exactly what's in the dropdown:
- "dog" (lowercase)
- "cat" (lowercase)
- "bird" (lowercase)
- "rabbit" (lowercase)
- "other" (lowercase)

---

## 🔍 Advanced Debugging

### Step 1: Check Browser Console
Open Developer Tools and check for actual API error:

```
1. Press F12 to open DevTools
2. Go to "Console" tab
3. Try adding the pet again
4. Look for error messages like:
   - "401 Unauthorized" → Token expired
   - "400 Bad Request" → Invalid data
   - "500 Internal Server Error" → Backend error
5. Expand the error to see details
```

### Step 2: Check Network Tab
See exactly what error the API returned:

```
1. Open DevTools (F12)
2. Go to "Network" tab
3. Try adding the pet
4. Look for POST request to "pets" endpoint
5. Click on it and check the Response tab
6. Note the error message
```

Common API responses:

| Status | Meaning | Solution |
|--------|---------|----------|
| 401 Unauthorized | Token invalid/expired | Logout and login again |
| 400 Bad Request | Invalid data format | Check form data |
| 500 Server Error | Backend crashed | Check if backend is running |

### Step 3: Check Backend Server
In the terminal where backend is running, look for error logs:

```
Look for lines like:
❌ Error creating pet: [error message]
```

This will show the exact backend error.

---

## 🧪 Manual Testing

If you want to test without the UI:

### Get Your Auth Token

```
1. Login to the app
2. Open DevTools (F12)
3. Go to Console tab
4. Run: localStorage.getItem('token')
5. Copy the token (starts with "eyJ...")
```

### Test API Directly

Save this as `test-pet.ps1` and run:

```powershell
$token = "YOUR_TOKEN_HERE"  # Replace with actual token
$petData = @{
    name = "rocks"
    type = "dog"
    breed = "country dog"
    age = 8
    weight = 6
    color = "white"
    vaccinated = $true
    neutered = $true
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/pets" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Body $petData `
  -UseBasicParsing `
  -Verbose
```

This will show exactly what error the API returns.

---

## ✅ Verification Checklist

Before trying again, verify:

- [ ] Backend server is running (`npm start` in backend folder)
- [ ] Frontend is running (`npm run dev` in frontend folder)  
- [ ] You are logged in
- [ ] Token is valid (recently logged in)
- [ ] Browser console has no errors
- [ ] Pet name is not empty
- [ ] Pet type matches dropdown options
- [ ] All fields are correct data type

---

## 🆘 If Still Not Working

### Check 1: Backend Running?
```powershell
# Check if process is listening on port 5000
Get-NetTCPConnection -LocalPort 5000 | Where-Object State -eq LISTEN
```

Should show a listening process. If not, backend is not running:
```bash
cd backend
npm install  # if needed
npm start    # start backend
```

### Check 2: Frontend Issues?
```bash
# Clear cache and reinstall
cd frontend
rm -r node_modules
npm install
npm run dev
```

### Check 3: Database Issues?
```bash
# Delete corrupted database and recreate
cd backend
rm -f data/petcare.db
npm start  # Backend will recreate database
```

---

## 📞 Debug Information to Provide

If you need help, provide:

1. **Browser Console Error** (F12 → Console)
2. **Network Response** (F12 → Network → POST /api/pets → Response)
3. **Backend Error Log** (terminal output from `npm start`)
4. **Your Input Data** (name, type, weight, age, etc.)

---

## 🚀 Expected Success Flow

1. ✅ Open app and login
2. ✅ Go to "My Pets" tab
3. ✅ Click "Add New Pet"
4. ✅ Fill in form:
   - Name: "rocks"
   - Type: "dog" (from dropdown)
   - Breed: "country dog"
   - Age: "8"
   - Weight: "6"
   - Color: "white"
   - Check "Vaccinated"
   - Check "Neutered"
5. ✅ Click "Add Pet"
6. ✅ See "🎉 rocks added successfully!" message
7. ✅ Pet appears in list below

---

## Common Error Scenarios

### Scenario 1: "Error creating pet" with token warning

**Issue**: Token is missing or expired
**Fix**: Logout → Clear browser cache → Login again

### Scenario 2: No error message, but pet doesn't appear

**Issue**: Pet created but not fetched
**Fix**: Refresh page (F5)

### Scenario 3: Backend error logs show database issue

**Issue**: Database corrupted
**Fix**: Delete data/petcare.db and restart

### Scenario 4: "Invalid token" error

**Issue**: Token format is wrong
**Fix**: Logout → Login again with fresh token

---

## Contact Support

If you've tried all these steps and still have issues:

1. Provide the error message from browser console
2. Provide the backend error log
3. Specify your inputs exactly
4. Run a full system diagnostic: `node backend/src/diagnostic.js`

