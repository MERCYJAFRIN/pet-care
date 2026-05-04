const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'data', 'petcare.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening DB:', err.message);
        process.exit(1);
    }

    db.get("SELECT email, role, is_verified FROM users WHERE email='zeek@gmail.com'", (err, row) => {
        if (err) {
            console.error('Query error:', err.message);
        } else {
            console.log('ZEEK_ROLE_CHECK:' + JSON.stringify(row));
        }
        db.close(() => process.exit(0));
    });
});
