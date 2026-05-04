# Week 3-4: Health Tracking Module - Maintenance & Troubleshooting Guide

**For Production Support & Maintenance**  
**Last Updated:** February 25, 2026

---

## Overview

This guide helps maintain and troubleshoot health tracking features in production environments.

---

## Health Tracking Features Health Check

### Quick Health Status
```bash
# Run these checks to verify system health

# 1. Backend running
curl http://localhost:5000/api/health

# 2. Database connected
# Check backend logs for "Database connected"

# 3. Cron jobs running
# Check logs for scheduled tasks

# 4. Frontend accessible
# Visit http://localhost:3001

# 5. All services loaded
# Check browser console for errors
```

---

## Common Issues & Solutions

### Issue 1: Analytics Dashboard Shows No Data

**Symptoms:**
- Charts appear empty
- "No data available" message
- Graphs have no points

**Possible Causes:**
- No health records added yet
- Pet not selected
- API error retrieving data
- Date range filter too narrow

**Solutions:**

1. **Verify pet has data:**
   ```bash
   # Check if weight records exist
   curl "http://localhost:5000/api/pets/PET_ID/analytics/weight-trend" \
     -H "Authorization: Bearer TOKEN"
   ```

2. **Add test data:**
   - Add weight: 30kg today
   - Add weight: 29kg one week ago
   - Add weight: 28kg two weeks ago

3. **Check time period:**
   - Make sure dates fall within selected period
   - Default is 90 days for weight, 30 days for temperature

4. **Check browser console:**
   - Look for API errors
   - Check network tab for failed requests

**Verification Steps:**
- [ ] Pet selected in dropdown
- [ ] Date records within range
- [ ] Browser console shows no errors
- [ ] API returns data (test with curl)

---

### Issue 2: Reminders Not Appearing

**Symptoms:**
- Reminders created but don't show in list
- No notifications sent
- "Upcoming reminders" section empty

**Possible Causes:**
- Reminder date is past (already occurred)
- Wrong pet selected
- Cron job not running
- Browser cache issue

**Solutions:**

1. **Check reminder date:**
   ```javascript
   // Verify reminder is set for future date
   console.log('Reminder date:', reminderDate);
   console.log('Today:', new Date());
   ```

2. **Verify cron scheduler running:**
   - Check backend logs for "NotificationScheduler started"
   - Verify node-cron installed: `npm list node-cron`

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+Delete
   - Clear localStorage for app

4. **Check database:**
   - Verify reminder exists in HealthReminders table
   - Verify petId is correct
   - Verify date is in future

**Verification Steps:**
- [ ] Reminder date set to future
- [ ] Backend logs show cron job running
- [ ] Pet selection correct
- [ ] Browser cache cleared

---

### Issue 3: Weight Chart Not Updating

**Symptoms:**
- New weight added but chart doesn't update
- Shows old data
- Must refresh page to see new data

**Possible Causes:**
- API cache not cleared
- Chart component not re-rendering
- Weight not persisting to database
- Time filter hiding new data

**Solutions:**

1. **Force component refresh:**
   ```javascript
   // In WeightLossTracking.jsx
   // After adding weight, call:
   fetchWeightData();
   ```

2. **Check time period filter:**
   - New weight might be outside visible range
   - Make sure selected period includes today
   - Try "All Time" filter

3. **Verify in database:**
   ```bash
   # Check if weight record saved
   SELECT * FROM WeightLosses WHERE petId = 'PET_ID' ORDER BY createdAt DESC;
   ```

4. **Clear API cache:**
   - In `api.js`, ensure no caching headers
   - Check axios interceptors

**Verification Steps:**
- [ ] Weight record appears in list immediately
- [ ] Database has new record
- [ ] Chart updates within 2 seconds
- [ ] Time filter includes new date

---

### Issue 4: Vaccination Status Not Calculating Correctly

**Symptoms:**
- Completed vaccines show as "Pending"
- Overdue vaccines not flagged
- Status doesn't match expected value

**Possible Causes:**
- Status calculation logic error
- Date format issue
- Timezone mismatch
- Database status not updating

**Solutions:**

1. **Check vaccination controller logic:**
   ```javascript
   // In vaccinationController.js, verify status calculation:
   const today = new Date().toISOString().split('T')[0];
   if (vaccinationDate === today) status = 'completed';
   else if (dueDate < today) status = 'overdue';
   ```

2. **Verify date formats:**
   - All dates should be ISO format (YYYY-MM-DD)
   - Database stored consistently
   - Frontend formatting consistent

3. **Check timezone:**
   ```javascript
   // Use UTC for consistency
   const date = new Date().toISOString();
   ```

4. **Manual status fix:**
   ```sql
   UPDATE Vaccinations 
   SET status = 'completed' 
   WHERE id = 'VACCINATION_ID';
   ```

**Verification Steps:**
- [ ] Duedate earlier than today = overdue
- [ ] Vaccination date in past = completed
- [ ] Vaccination date in future = scheduled
- [ ] Dates in correct ISO format

---

### Issue 5: Medical History Not Showing

**Symptoms:**
- "No medical records found" message
- Records created but not visible
- List appears empty

**Possible Causes:**
- Pet not selected correctly
- Records linked to wrong pet
- API error (petId mismatch)
- Frontend filtering issue

**Solutions:**

1. **Verify pet selection:**
   ```javascript
   console.log('Selected pet ID:', selectedPetId);
   ```

2. **Check API call:**
   ```bash
   curl "http://localhost:5000/api/pets/CORRECT_PET_ID/medical-history" \
     -H "Authorization: Bearer TOKEN"
   ```

3. **Verify database records:**
   ```sql
   SELECT * FROM MedicalHistories WHERE petId = 'PET_ID';
   ```

4. **Check petId consistency:**
   - Ensure petId used in API matches database
   - No UUID format issues
   - UUIDs not null

**Verification Steps:**
- [ ] Pet dropdown shows correct selection
- [ ] API returns data with curl
- [ ] Database has records with correct petId
- [ ] No console errors

---

### Issue 6: Medicine Schedule Not Tracking

**Symptoms:**
- Medicines don't update when marked as given
- "Active medicines" list not filtering
- End dates not calculated

**Possible Causes:**
- Medicine record not persisting
- Status tracking not updating
- Date calculations wrong
- Frontend not re-rendering

**Solutions:**

1. **Verify medicine saved:**
   ```bash
   curl "http://localhost:5000/api/pets/PET_ID/medicine-schedule" \
     -H "Authorization: Bearer TOKEN"
   ```

2. **Check end date calculation:**
   ```javascript
   // Start date + duration should equal end date
   const startDate = new Date('2024-02-25');
   const durationDays = 14;
   const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
   ```

3. **Update medicine status:**
   ```sql
   UPDATE MedicineSchedules 
   SET lastGiven = NOW() 
   WHERE id = 'MEDICINE_ID';
   ```

4. **Refresh component after update:**
   - Component should re-fetch data
   - Check useEffect dependencies

**Verification Steps:**
- [ ] Medicine list shows correct count
- [ ] End date calculated correctly
- [ ] "Mark as given" updates UI
- [ ] Completed medicines moved to history

---

### Issue 7: Notification Scheduler Not Running

**Symptoms:**
- No automatic reminders created
- Vaccination reminders not sent
- Background tasks not executing

**Possible Causes:**
- Cron job not started
- Node-cron not installed
- Scheduler error (check logs)
- Database not accessible to scheduler

**Solutions:**

1. **Verify scheduler started:**
   ```javascript
   // In server.js, add after database connection:
   const NotificationScheduler = require('./services/NotificationScheduler');
   console.log('Starting notification scheduler...');
   NotificationScheduler.startScheduler();
   ```

2. **Check node-cron installed:**
   ```bash
   npm list node-cron
   # Should show version installed
   ```

3. **Review scheduler logs:**
   ```bash
   # Add to backend logs (start.log)
   npm run dev > start.log 2>&1
   # Then check: tail -f start.log
   ```

4. **Manual trigger for testing:**
   ```javascript
   // In scheduler, add manual endpoint
   app.get('/api/admin/trigger-reminders', async (req, res) => {
     NotificationScheduler.checkReminders();
     res.json({ message: 'Reminders checked' });
   });
   ```

**Verification Steps:**
- [ ] Backend logs show "NotificationScheduler started"
- [ ] No errors in console
- [ ] Reminders created for upcoming vaccinations
- [ ] Cron pattern correct (8 AM daily, etc)

---

### Issue 8: Database Corrupted or Locked

**Symptoms:**
- "Database locked" error
- Cannot create/read records
- "SQLITE_IOERR" errors
- Duplicate connections error

**Possible Causes:**
- Multiple backend instances running
- Stale connections not closing
- File permissions issue
- Concurrent access conflict

**Solutions:**

1. **Stop backend:**
   ```bash
   # Find process
   Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess
   # Kill it
   Stop-Process -Id <PID> -Force
   ```

2. **Delete corrupted database:**
   ```bash
   cd backend
   rm -rf data/database.sqlite
   npm run dev  # Will recreate clean database
   ```

3. **Repair database:**
   ```bash
   # Backup first
   cp data/database.sqlite data/database.sqlite.backup
   # Then restart backend
   npm run dev
   ```

4. **Check file permissions:**
   - Ensure write access to data/ folder
   - Run as admin if needed

**Verification Steps:**
- [ ] Backend restarts successfully
- [ ] No "locked" errors in logs
- [ ] Can create new pet without errors
- [ ] All queries work

---

### Issue 9: Chart Libraries Not Rendering

**Symptoms:**
- Charts not visible
- White canvas area
- Console JavaScript error about Recharts

**Possible Causes:**
- Recharts not installed
- Chart data format wrong
- ResponsiveContainer missing proper sizing
- Browser compatibility issue

**Solutions:**

1. **Verify Recharts installed:**
   ```bash
   cd frontend
   npm list recharts
   # Should show version
   ```

2. **Check chart data format:**
   ```javascript
   // Data must be array of objects
   const chartData = [
     { name: '2024-02-01', value: 30 },
     { name: '2024-02-08', value: 29.5 }
   ];
   // Not strings or other formats
   ```

3. **Verify ResponsiveContainer:**
   ```jsx
   <ResponsiveContainer width="100%" height={300}>
     <LineChart data={data}>
       {/* Chart content */}
     </LineChart>
   </ResponsiveContainer>
   ```

4. **Reinstall dependencies:**
   ```bash
   npm install
   npm run dev
   ```

**Verification Steps:**
- [ ] npm list shows recharts
- [ ] Chart data validates before render
- [ ] ResponsiveContainer has dimensions
- [ ] No console errors

---

### Issue 10: User Data Isolation Issues

**Symptoms:**
- User A sees User B's pets
- Medical records mixed between users
- Security breach concern

**Possible Causes:**
- Missing userId check in controller
- Frontend not isolating by userId
- Token validation issue
- Authorization bypass

**Solutions:**

1. **Always verify userId in controllers:**
   ```javascript
   // REQUIRED in every endpoint
   const pet = await Pet.findOne({
     where: { id: petId, userId: req.userId }
   });
   if (!pet) {
     return res.status(403).json({ message: 'Unauthorized' });
   }
   ```

2. **Check middleware verifying token:**
   ```javascript
   // In authMiddleware.js
   const authMiddleware = (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) return res.status(401).json({ message: 'No token' });
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.userId = decoded.userId;
       next();
     } catch (error) {
       return res.status(401).json({ message: 'Invalid token' });
     }
   };
   ```

3. **Frontend token management:**
   ```javascript
   // Always include token in header
   const token = localStorage.getItem('token');
   const config = {
     headers: { Authorization: `Bearer ${token}` }
   };
   ```

4. **Audit log access:**
   ```javascript
   // Add logging to track data access
   console.log(`User ${req.userId} accessed pet ${petId}`);
   ```

**Verification Steps:**
- [ ] Login as User A, verify only their pets
- [ ] Login as User B, verify only their pets
- [ ] Cannot access User A's data from User B session
- [ ] userId validated in all controllers

---

## Performance Monitoring

### Monitor These Metrics

**Response Times:**
```bash
# Check backend response times in logs
# Target: <200ms for most endpoints
# Analytics: <500ms acceptable
```

**Database Performance:**
```bash
# Check query execution times
# Slow queries take >1 second
# Add indexes if needed
```

**Chart Rendering:**
```bash
# Measure on client side
console.time('chartRender');
// ... chart rendering
console.timeEnd('chartRender');
// Target: <2 seconds for 100+ data points
```

**Memory Usage:**
```bash
# Monitor backend memory
node --max-old-space-size=512 src/server.js
```

---

## Maintenance Tasks

### Daily
- [ ] Monitor error logs
- [ ] Check disk space (database size)
- [ ] Verify cron jobs running
- [ ] Check for failed API calls

### Weekly
- [ ] Backup database
- [ ] Review performance metrics
- [ ] Check for memory leaks
- [ ] Update monitoring dashboards

### Monthly
- [ ] Database optimization (vacuum, indexes)
- [ ] Security audit (check auth patterns)
- [ ] Data integrity checks
- [ ] Plan capacity upgrades

### Quarterly
- [ ] Major security updates
- [ ] Performance tuning
- [ ] Dependency updates
- [ ] Disaster recovery test

---

## Backup & Recovery

### Database Backup
```bash
# Backup
cp -r data data-backup-$(date +%Y%m%d)

# Restore
cp -r data-backup-20240225/* data/
npm run dev
```

### Configuration Backup
```bash
# Backup .env
cp .env .env.backup

# Backup routes, models
tar -czf backend-backup.tar.gz backend/src/
```

### Recovery Procedure
1. Stop backend
2. Restore files from backup
3. Verify database integrity
4. Restart backend
5. Run tests to verify

---

## Emergency Procedures

### System Down / Database Corrupted
1. Stop backend immediately
2. Restore from backup
3. Restart backend
4. Verify all services
5. Notify users if data loss

### Massive Data Inconsistency
1. Identify issue scope
2. Take backup of current state
3. Run data integrity checks
4. Apply fixes incrementally
5. Verify completeness

### Security Breach Suspected
1. Audit access logs for unauthorized access
2. Rotate all JWT secrets
3. Force user re-authentication
4. Review and fix authorization logic
5. Document incident

---

## Useful SQL Queries

### Pet Summary
```sql
SELECT 
  p.id,
  p.name,
  COUNT(DISTINCT m.id) as medical_records,
  COUNT(DISTINCT v.id) as vaccinations,
  COUNT(DISTINCT w.id) as weight_records
FROM Pets p
LEFT JOIN MedicalHistories m ON p.id = m.petId
LEFT JOIN Vaccinations v ON p.id = v.petId
LEFT JOIN WeightLosses w ON p.id = w.petId
WHERE p.userId = 'USER_ID'
GROUP BY p.id;
```

### Overdue Vaccinations
```sql
SELECT * FROM Vaccinations
WHERE status = 'overdue'
   OR (dueDate < DATE('now') AND status != 'completed')
ORDER BY dueDate ASC;
```

### Active Medicines
```sql
SELECT * FROM MedicineSchedules
WHERE endDate >= DATE('now')
  AND petId = 'PET_ID'
ORDER BY endDate ASC;
```

### User Data Size
```sql
SELECT 
  COUNT(DISTINCT petId) as total_pets,
  COUNT(DISTINCT medicalHistoryId) as medical_records
FROM (
  SELECT petId, NULL FROM Pets
  UNION
  SELECT petId, id FROM MedicalHistories
);
```

---

## Performance Tuning Tips

### Database Optimization
1. Add indexes on frequently queried columns
2. Regular VACUUM to defragment
3. Delete old notifications (archive)
4. Partition large analytics tables

### Backend Optimization
1. Implement caching for analytics
2. Batch health reminder checks
3. Queue long-running tasks
4. Connection pooling for database

### Frontend Optimization
1. Lazy load charts
2. Paginate long lists
3. Virtual scrolling for large datasets
4. Compress images

---

## Logs & Monitoring

### Enable Detailed Logging
```javascript
// In server.js
const morgan = require('morgan');
app.use(morgan('dev')); // Development logging
// Or for production:
// app.use(morgan('combined', { stream: fs.createWriteStream('access.log') }));
```

### Monitor Files
```bash
# Tail logs
tail -f logs/app.log
tail -f logs/error.log

# Search for errors
grep "ERROR" logs/app.log
grep "warning" logs/app.log
```

### Set Up Alerts
- Alert on >5% failed requests
- Alert on response time >1 second
- Alert on database errors
- Alert on memory usage >80%

---

## Contact & Escalation

### Support Contacts
- **Backend Issues:** Check logs first, then review code
- **Database Issues:** Backup, restore, verify
- **Frontend Issues:** Check browser console
- **User Issues:** Verify pet selection, data exists

### Documentation
- Check TROUBLESHOOTING.md
- Review DEVELOPER_QUICK_REFERENCE.md
- Check relevant component documentation
- Review API_DOCUMENTATION.md

---

**Last Updated:** February 25, 2026  
**Version:** 1.0  
**Maintenance Team:** On-call Support

For urgent issues, follow emergency procedures and contact development team immediately.
