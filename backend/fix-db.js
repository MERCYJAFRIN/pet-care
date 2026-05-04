const sequelize = require('./src/config/database');

async function fixDb() {
  console.log('--- FIXING DATABASE ---');
  try {
    const queryInterface = sequelize.getQueryInterface();
    const [columns] = await sequelize.query('PRAGMA table_info(users)');
    const columnNames = columns.map(c => c.name);

    if (!columnNames.includes('is_verified')) {
      console.log('Adding is_verified column...');
      await sequelize.query('ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0');
    }
    if (!columnNames.includes('verification_code')) {
      console.log('Adding verification_code column...');
      await sequelize.query('ALTER TABLE users ADD COLUMN verification_code VARCHAR(255)');
    }
    if (!columnNames.includes('certificate_number')) {
      console.log('Adding certificate_number column...');
      await sequelize.query('ALTER TABLE users ADD COLUMN certificate_number VARCHAR(255)');
    }

    console.log('Updating user zeek to doctor role...');
    await sequelize.query("UPDATE users SET role = 'doctor', is_verified = 1 WHERE email = 'zeek@gmail.com'");

    console.log('Database fixed successfully!');
  } catch (err) {
    console.error('Fix error:', err);
  } finally {
    process.exit(0);
  }
}

fixDb();
