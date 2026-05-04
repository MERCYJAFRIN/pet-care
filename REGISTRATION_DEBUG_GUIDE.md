# Registration Debugging Guide

## Status: ✅ Backend Working   
The registration endpoint has been tested and confirmed working:
- **Endpoint**: POST http://localhost:5000/api/auth/register
- **Status**: 201 Created
- **Response**: Token generated successfully
- **Database**: User created successfully

## Frontend Testing Steps

### Step 1: Check Browser Console
1. Open the app at http://localhost:3003
2. Press **F12** or **Ctrl+Shift+I** to open Developer Tools
3. Go to the **Console** tab
4. Keep the console open and try to register
5. Look for any error messages (shown in red)

### Step 2: Try Registration with Console Open
1. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: Test123!@
   - Phone: 9876543210

2. Click "Register"

3. In the console, you should see:
   ```
   🔍 Starting registration with: {...}
   📡 API Request: {...}
   ```

### Step 3: Check for Common Issues

#### Issue 1: CORS Error
**Sign**: "Access to XMLHttpRequest at 'http://localhost:5000/api/auth/register'..."
**Solution**: CORS is already enabled on backend, try clearing browser cache

#### Issue 2: Network Error
**Sign**: "A network error occurred while processing the request"
**Solution**: 
- Verify backend is running: http://localhost:5000/api/health
- Check if port 5000 is open: `Get-Process node`

#### Issue 3: 404 Error
**Sign**: "404 Not Found"
**Solution**: Backend routes might not be loaded. Restart backend server.

#### Issue 4: Form Validation
**Sign**: Error message appears instantly without network request  
**Solution**: Check all required fields are filled (email, password, firstName, lastName)

## Manual Testing via PowerShell

```powershell
# Test registration directly
$body = @{
    email = "test@test.com"
    password = "Test123!"
    firstName = "Test"
    lastName = "User"
    phone = "1234567890"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | Format-List
```

## Automated Test Script

Run the included test script:
```bash
node test-registration.js
```

This will:
1. Create a test user with random email
2. Send request to backend
3. Show response status and data
4. Display token if successful

## Expected Success Response

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "645bd682-f522-4aca-8221-e3cd8ebb53cb",
    "email": "testuser@example.com",
    "firstName": "Test",
    "lastName": "User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Next Steps After Successful Registration

1. Token should be stored in localStorage as 'token'
2. User data should be stored in localStorage as 'user'
3. Page should redirect to dashboard
4. You should be able to add pets and create appointments

## Troubleshooting Commands

```powershell
# Check if servers are running
Get-Process node

# Check backend health
Invoke-RestMethod -Uri "http://localhost:5000/api/health"

# View browser console errors
# Press F12 in browser -> Console tab

# Check frontend console network requests
# Press F12 in browser -> Network tab
# Try to register and watch the request/response

# Restart servers
.\start-app.bat
```

## Database Check

To verify users are being created:
```powershell
cd backend
node -e "
const { sequelize, User } = require('./src/models');
sequelize.authenticate().then(async () => {
  const users = await User.findAll();
  console.log('Total users:', users.length);
  users.forEach(u => console.log('-', u.email, u.firstName, u.lastName));
}).catch(err => console.error('DB Error:', err));
"
```

## Getting Help

When reporting issues, provide:
1. Screenshot of error message
2. Browser console output (F12 -> Console)
3. Network request details (F12 -> Network)
4. Backend server logs (from terminal)
5. Result of running `node test-registration.js`
