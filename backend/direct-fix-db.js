const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'petcare.db');
const logPath = path.join(__dirname, 'direct_fix_log.txt');

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logPath, msg + '\n');
}

if (fs.existsSync(logPath)) fs.unlinkSync(logPath);

log('--- START DIRECT DB FIX ---');
log('DB Path: ' + dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        log('Error opening DB: ' + err.message);
        process.exit(1);
    }
    log('Connected to SQLite DB.');

    db.serialize(() => {
        // Add columns
        log('Checking columns...');
        db.all("PRAGMA table_info(users)", (err, rows) => {
            if (err) {
                log('Error checking columns: ' + err.message);
                return;
            }
            const names = rows.map(r => r.name);
            log('Current columns: ' + names.join(', '));

            if (!names.includes('is_verified')) {
                log('Adding is_verified...');
                db.run("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0");
            }
            if (!names.includes('verification_code')) {
                log('Adding verification_code...');
                db.run("ALTER TABLE users ADD COLUMN verification_code VARCHAR(255)");
            }
            if (!names.includes('certificate_number')) {
                log('Adding certificate_number...');
                db.run("ALTER TABLE users ADD COLUMN certificate_number VARCHAR(255)");
            }

            // Update zeek
            log('Updating zeek...');
            db.run("UPDATE users SET role = 'doctor', is_verified = 1 WHERE email = 'zeek@gmail.com'", function (err) {
                if (err) {
                    log('Error updating zeek: ' + err.message);
                } else {
                    log('Updated zeek successfully. Rows affected: ' + this.changes);
                }

                // Final check
                db.get("SELECT email, role FROM users WHERE email='zeek@gmail.com'", (err, row) => {
                    log('Final check: ' + JSON.stringify(row));
                    db.close(() => {
                        log('--- END DIRECT DB FIX ---');
                        process.exit(0);
                    });
                });
            });
        });
    });
});
