const sequelize = require('./src/config/database');
const fs = require('fs');

async function fixDb() {
    console.log('--- FIXING DATABASE V2 ---');
    let log = '';
    try {
        await sequelize.authenticate();
        log += 'Sequelize authenticated.\n';

        // Check current columns
        const [columns] = await sequelize.query('PRAGMA table_info(users)');
        const columnNames = columns.map(c => c.name);
        log += `Current columns: ${columnNames.join(', ')}\n`;

        if (!columnNames.includes('is_verified')) {
            log += 'Adding is_verified...\n';
            await sequelize.query('ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0');
        }
        if (!columnNames.includes('verification_code')) {
            log += 'Adding verification_code...\n';
            await sequelize.query('ALTER TABLE users ADD COLUMN verification_code VARCHAR(255)');
        }
        if (!columnNames.includes('certificate_number')) {
            log += 'Adding certificate_number...\n';
            await sequelize.query('ALTER TABLE users ADD COLUMN certificate_number VARCHAR(255)');
        }

        log += 'Updating zeek to doctor...\n';
        const [results] = await sequelize.query("UPDATE users SET role = 'doctor', is_verified = 1 WHERE email = 'zeek@gmail.com'");
        log += `Update results: ${JSON.stringify(results)}\n`;

        const [verify] = await sequelize.query("SELECT email, role, is_verified FROM users WHERE email = 'zeek@gmail.com'");
        log += `Post-update verification: ${JSON.stringify(verify)}\n`;

    } catch (err) {
        log += `FIX ERROR: ${err.message}\n`;
    } finally {
        fs.writeFileSync('fix_log.txt', log);
        process.exit(0);
    }
}

fixDb();
