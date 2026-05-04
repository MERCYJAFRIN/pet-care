# Pet Care Application - Troubleshooting & FAQ Guide

## Common Issues & Solutions

---

## Backend Issues

### Issue: "Cannot find module 'sequelize'"
**Symptoms:**
```
Error: Cannot find module 'sequelize'
```

**Causes:**
- Dependencies not installed
- Wrong directory
- node_modules corrupted

**Solutions:**
1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. If problem persists, clean and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

---

### Issue: "Port 5000 is already in use"
**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Causes:**
- Another server running on same port
- Previous server didn't close properly
- Port conflict with another application

**Solutions:**

**Option 1: Kill the process (Windows PowerShell)**
```powershell
# Find process on port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess

# Kill the process (replace 1234 with actual PID)
Stop-Process -Id 1234 -Force
```

**Option 2: Use different port**
```javascript
// In server.js, change:
const PORT = 5001; // Use different port
```

**Option 3: Restart computer**

---

### Issue: "Database connection failed"
**Symptoms:**
```
Error: unable to open database file
```

**Causes:**
- Database file corrupted
- data folder missing
- Permission issues

**Solutions:**

1. Check if data folder exists:
   ```bash
   # From backend directory
   ls -la data/
   # or on Windows: dir data
   ```

2. Create data folder if missing:
   ```bash
   mkdir data
   ```

3. Delete corrupted database:
   ```bash
   rm -f data/database.sqlite
   # Database will auto-recreate on restart
   ```

4. Restart server:
   ```bash
   npm start
   ```

---

### Issue: "JWT token is invalid"
**Symptoms:**
```
Error: Invalid token
Status: 401 Unauthorized
```

**Causes:**
- Expired token
- Wrong secret key
- Malformed token in header

**Solutions:**

1. Clear stored token and login again:
   ```javascript
   // In browser console:
   localStorage.removeItem('token');
   // Then refresh and login
   ```

2. Check token sent in request:
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('token'));
   ```

3. Verify Authorization header format:
   ```
   Authorization: Bearer {token}
   // Not: Authorization: {token}
   // Not: Bearer: {token}
   ```

---

### Issue: "CORS error: Access denied"
**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Causes:**
- Frontend and backend on different origins
- CORS not configured
- Wrong URL in request

**Solutions:**

1. Check CORS settings in server.js:
   ```javascript
   app.use(cors({
     origin: 'http://localhost:5173', // Vite dev server
     credentials: true
   }));
   ```

2. Verify frontend makes requests to correct URL:
   ```javascript
   // Check environment or api.js
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

3. For production, update CORS origin:
   ```javascript
   app.use(cors({
     origin: 'https://yourdomain.com',
     credentials: true
   }));
   ```

---

### Issue: "Cannot POST /api/pets/{petId}/vaccinations"
**Symptoms:**
```
Error: Cannot POST /api/pets/123/vaccinations
Status: 404 Not Found
```

**Causes:**
- Route not registered
- Wrong URL path
- Route missing from server.js

**Solutions:**

1. Verify route is imported in server.js:
   ```javascript
   // server.js should have:
   const vaccinationRoutes = require('./routes/vaccinationRoutes');
   app.use('/api/pets/:petId/vaccinations', vaccinationRoutes);
   ```

2. Check route file exists:
   ```bash
   ls src/routes/vaccinationRoutes.js
   ```

3. Verify endpoint in route file:
   ```javascript
   // vaccinationRoutes.js should have:
   router.post('/', createVaccination);
   ```

4. Restart server after fixing

---

## Frontend Issues

### Issue: "Cannot find module '@/components/...'"
**Symptoms:**
```
Module not found: Error: Can't resolve '@/components/VaccinationManagement'
```

**Causes:**
- Component file missing
- Wrong file path
- vite alias configuration

**Solutions:**

1. Check component exists:
   ```bash
   ls src/components/VaccinationManagement.jsx
   ```

2. Verify import path:
   ```javascript
   // Correct:
   import VaccinationManagement from '../components/VaccinationManagement';
   
   // Wrong:
   import VaccinationManagement from '@/VaccinationManagement';
   ```

3. Check vite.config.js for alias configuration

4. Restart dev server:
   ```bash
   npm run dev
   ```

---

### Issue: "Blank page or white screen"
**Symptoms:**
- Page loads but displays nothing
- No error in console

**Causes:**
- Component error not caught
- Missing CSS
- API not responding
- React state issue

**Solutions:**

1. Check browser console for errors:
   ```
   F12 → Console tab → Look for red errors
   ```

2. Check React Developer Tools:
   - Install React Developer Tools extension
   - Look for component errors

3. Check network tab:
   - F12 → Network tab
   - Look for failed requests
   - Check response status codes

4. Verify CSS is imported:
   ```javascript
   // App.jsx should import styles:
   import './styles/app.css';
   ```

5. Check App.jsx for component rendering:
   ```javascript
   return (
     <div className="app">
       {/* Components should be here */}
     </div>
   );
   ```

---

### Issue: "API calls failing with 401 Unauthorized"
**Symptoms:**
```
Error: Request failed with status code 401
Error: No token provided
```

**Causes:**
- Token not stored after login
- Token expired
- Token not sent in request headers

**Solutions:**

1. Verify login successful:
   ```javascript
   // After login, check:
   console.log(localStorage.getItem('token'));
   // Should output token string, not null
   ```

2. Check login form:
   ```javascript
   // Login should store token:
   localStorage.setItem('token', response.data.token);
   ```

3. Verify API service includes token:
   ```javascript
   // api.js should have:
   const token = localStorage.getItem('token');
   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   ```

4. Re-login if needed

---

### Issue: "Data not updating after API call"
**Symptoms:**
- API call successful but UI doesn't update
- Old data still displayed

**Causes:**
- State not updated after API response
- useEffect not triggering
- Component not re-rendering

**Solutions:**

1. Check state update after API call:
   ```javascript
   // Should have:
   const [items, setItems] = useState([]);
   
   const addItem = async (data) => {
     const response = await api.post('/endpoint', data);
     setItems([...items, response.data.item]); // Update state
   };
   ```

2. Verify useEffect dependencies:
   ```javascript
   // Should fetch when pet changes:
   useEffect(() => {
     if (selectedPetId) {
       fetchItems();
     }
   }, [selectedPetId]); // Include dependency
   ```

3. Check browser React DevTools:
   - Select component
   - Check if state is updating
   - Look for re-render count

---

### Issue: "Form values not being cleared after submission"
**Symptoms:**
- Form data remains after adding item
- Previous values still visible

**Causes:**
- formData state not reset
- Form fields bound to state

**Solutions:**

```javascript
// After successful submission:
const handleAdd = async () => {
  await service.create(formData);
  
  // Reset form
  setFormData({
    field1: '',
    field2: '',
    // Reset all fields
  });
  
  // Refresh list
  await fetchItems();
};
```

---

## Database Issues

### Issue: "All entries deleted accidentally"
**Symptoms:**
- Database is empty
- All records disappeared

**Causes:**
- Accidental delete operation
- Database reset
- Migration issue

**Solutions:**

1. Check if backup exists:
   ```bash
   ls -la data/
   # Look for .bak or .backup files
   ```

2. Restore from backup:
   ```bash
   cp data/database.sqlite.bak data/database.sqlite
   ```

3. If no backup:
   - Cannot recover data
   - Database auto-creates on next run
   - Re-enter data

4. Implement backup strategy for future

---

### Issue: "Database table structure mismatch"
**Symptoms:**
```
Error: SequelizeError: Unknown column 'reminderstatus'
```

**Causes:**
- Model definition changed
- Database not updated
- Migration failure

**Solutions:**

1. Delete database and let it recreate:
   ```bash
   rm -f data/database.sqlite
   npm start
   # Database auto-creates with correct schema
   ```

2. Restart backend to force schema update:
   ```bash
   # Kill server
   npm start
   ```

---

## API Testing Issues

### Issue: "Postman requests failing"
**Symptoms:**
- 401 Unauthorized
- 404 Not Found
- CORS errors

**Solutions:**

1. Set Authorization header:
   ```
   Header: Authorization
   Value: Bearer {token_from_login}
   ```

2. Verify URL format:
   ```
   http://localhost:5000/api/pets/123/vaccinations
   ```

3. Set Content-Type:
   ```
   Header: Content-Type
   Value: application/json
   ```

4. Check request body format (JSON):
   ```json
   {
     "vaccineName": "Rabies",
     "vaccinationDate": "2024-02-15"
   }
   ```

---

### Issue: "POST request returns 400 Bad Request"
**Symptoms:**
```
Error: Bad request 400
message: "validation error"
```

**Causes:**
- Missing required fields
- Wrong data type
- Invalid date format
- Incorrect field names

**Solutions:**

1. Check required fields in request:
   ```json
   {
     "vaccineName": "Rabies",      // Required
     "vaccinationDate": "2024-02-15", // Required
     "nextDueDate": "2025-02-15"  // Required
   }
   ```

2. Verify data types:
   ```
   Strings: "text"
   Numbers: 123 (not "123")
   Dates: "2024-02-15" format
   Booleans: true/false (not "true")
   ```

3. Check API documentation for required fields

---

## Performance Issues

### Issue: "Slow page load / Long response time"
**Symptoms:**
- Page takes 5+ seconds to load
- API responses slow

**Causes:**
- Many items in list
- Complex queries
- Network latency

**Solutions:**

1. Add pagination to API calls:
   ```
   GET /api/endpoint?page=1&limit=20
   ```

2. Implement date range filtering:
   ```
   GET /endpoint?startDate=2024-01-01&endDate=2024-02-01
   ```

3. Check API response in Network tab:
   - F12 → Network → Check response size
   - Look for optimization opportunities

4. Check backend query performance:
   - Add database indexes
   - Optimize filters

---

### Issue: "Memory leak / App slowing down over time"
**Symptoms:**
- App gets slower after extended use
- Browser tab using lots of memory

**Causes:**
- Event listeners not cleaned up
- Large arrays in state
- Infinite loop in useEffect

**Solutions:**

1. Cleanup event listeners:
   ```javascript
   useEffect(() => {
     const handleResize = () => { /* ... */ };
     window.addEventListener('resize', handleResize);
     
     // Cleanup:
     return () => {
       window.removeEventListener('resize', handleResize);
     };
   }, []);
   ```

2. Implement pagination:
   ```javascript
   // Don't load all 1000 items
   // Load 50 at a time
   const [page, setPage] = useState(1);
   ```

3. Check for infinite loops:
   ```javascript
   // Wrong:
   useEffect(() => {
     setItems(allItems); // Causes re-render loop
   }); // No dependencies

   // Correct:
   useEffect(() => {
     setItems(allItems);
   }, []); // Empty dependencies (runs once)
   ```

---

## Security Issues

### Issue: "Token visible in network requests"
**Concern:** Token exposed in plaintext

**Solutions:**

1. Use HTTPS in production:
   ```
   https://yourdomain.com (encrypted)
   NOT http://yourdomain.com (plaintext)
   ```

2. Set token as HttpOnly cookie (future):
   ```javascript
   // Better than localStorage for security
   res.cookie('token', token, {
     httpOnly: true,
     secure: true,
     sameSite: 'strict'
   });
   ```

---

### Issue: "Unauthorized access to other users' pets"
**Symptoms:**
- Can view/edit other user's pets
- Cross-user data access

**Causes:**
- Missing userId check
- Authorization bypass

**Solutions:**

1. Verify userId in all controllers:
   ```javascript
   const pet = await Pet.findOne({
     where: { id: petId, userId: req.user.id }
   });
   if (!pet) return res.status(403).json(...);
   ```

2. Check all endpoints for user isolation

---

## Deployment Issues

### Issue: "Works locally but fails on production"
**Symptoms:**
- Localhost works fine
- Deployed version errors

**Causes:**
- Environment variables missing
- Different database
- Port or URL differences
- Node version mismatch

**Solutions:**

1. Check environment variables:
   ```bash
   # Create .env file on production server
   NODE_ENV=production
   PORT=80 or 443
   JWT_SECRET=production-secret-key
   ```

2. Verify database setup:
   ```bash
   # Check database exists in correct location
   ```

3. Check logs:
   ```bash
   # View production logs
   tail -f logs/error.log
   ```

4. Test API endpoints:
   ```bash
   curl https://yourdomain.com/api/health
   ```

---

## Frequently Asked Questions (FAQ)

### General Questions

**Q: How do I create a new user?**
A: Use the Register form on the authentication page or use Postman:
```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Q: Can multiple users use the same computer?**
A: Yes. Each login creates separate session. Log out and login as different user.

**Q: How long do sessions last?**
A: Tokens expire after set time (configurable in JWT secret).

---

### Pet Management

**Q: Can one user have multiple pets?**
A: Yes! Create as many pets as needed.

**Q: Can two users share a pet?**
A: No, each pet belongs to one user. Consider sharing login credentials for now.

**Q: Can I change my pet's name after creation?**
A: Yes, use the Edit Pet option.

---

### Health Features

**Q: What if I miss recording a medicine dose?**
A: Use "Mark Missed" to track missed doses. This helps you see medication compliance.

**Q: Can I schedule a medicine for just morning (not afternoon)?**
A: Yes! Use "Once Daily" frequency with only morning time.

**Q: How do I know if a vacation will affect appointments?**
A: Enable "Pause Services" to stop appointment/reminder notifications during vacation.

**Q: Can reminders be edited after creation?**
A: Yes! Click Edit on any reminder to change details or frequency.

---

### Technical Questions

**Q: What's the maximum file size for attachments?**
A: Currently no file size limit, but recommended < 5MB per file.

**Q: Do I need to backup my data?**
A: Yes! Create periodic backups of database.sqlite file.

**Q: Can I export my data?**
A: Planned for Phase 4. Currently use database directly.

**Q: Is my data encrypted?**
A: Passwords are hashed. Add SSL/HTTPS encryption in production.

---

### Troubleshooting Questions

**Q: I forgot my password. How do I reset it?**
A: Currently no password reset. Use "Forgot Password" feature when available (Phase 4).

**Q: How do I delete my account?**
A: Contact administrator. Auto-delete feature planned for Phase 5.

**Q: Can I have more than one pet selected?**
A: No, select one pet at a time. Switch between pets quickly.

**Q: Why is my data showing for wrong pet?**
A: Verify correct pet is selected in dropdown. Check petId in URL.

---

## Getting Help

### Documentation
- 📖 Refer to [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- 🧪 Check [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- ⚡ Review [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### Browser Developer Tools
```
F12 to open DevTools:
- Console: See error messages
- Network: Check API calls
- Application: Check localStorage
- Elements: Inspect DOM
```

### Debugging Steps
1. Check console for errors (F12)
2. Check network tab for failed requests
3. Verify correct URL/port
4. Check localStorage for token
5. Restart application
6. Clear browser cache
7. Try incognito/private mode

---

## Reporting Issues

When reporting an issue, include:
1. **Error message** (full text)
2. **Steps to reproduce** (what you did)
3. **Expected behavior** (what should happen)
4. **Actual behavior** (what happened)
5. **Browser/OS** (Chrome on Windows, etc.)
6. **Logs** (console or error log content)

---

## Tips & Tricks

### Speed Up Development
```bash
# Use npm run dev (watch mode)
npm run dev

# Auto-restart on file changes
# Already configured with nodemon
```

### Debug API Calls
```javascript
// Add logging before API call:
console.log('Calling API:', endpoint, data);

// Check response:
.then(res => console.log('Response:', res.data))
.catch(err => console.error('Error:', err.response))
```

### Test Without Frontend
```bash
# Use Postman to test endpoints directly
# Easier to verify API works correctly
```

### Quick Database Inspect
```sql
-- SQLite command line:
sqlite3 data/database.sqlite

-- Check tables:
.tables

-- Query data:
SELECT * FROM pets LIMIT 5;

-- Exit:
.quit
```

---

## Escalation Path

1. **Check this guide** - Most issues covered
2. **Check API_DOCUMENTATION.md** - Verify endpoints
3. **Check TESTING_GUIDE.md** - Test in isolation
4. **Review code** - Look for obvious issues
5. **Rebuild from scratch** - Fresh installation
6. **Contact support** - If unresolved

---

## Preventive Measures

1. **Regular Backups** ✓
   ```bash
   cp data/database.sqlite data/database.sqlite.backup
   ```

2. **Monitor Logs** ✓
   - Check console regularly
   - Watch for warnings

3. **Test After Changes** ✓
   - Test new features immediately
   - Verify existing features still work

4. **Keep Dependencies Updated** ✓
   ```bash
   npm outdated
   npm update
   ```

5. **Document Custom Changes** ✓
   - Record any modifications
   - Maintain change log

---

**Last Updated:** 2024
**For more help:** Refer to supporting documentation files

