const sequelize = require('./src/config/database');

async function checkRaw() {
    console.log('--- RAW DIAGNOSTIC ---');
    try {
        const [users] = await sequelize.query('SELECT firstName, lastName, email, role FROM users');
        console.log(`Users found: ${users.length}`);
        users.forEach(u => {
            console.log(`[USER] ${u.first_name || u.firstName} | ${u.email} | ROLE: ${u.role}`);
        });

        const [pets] = await sequelize.query('SELECT name, type FROM pets');
        console.log(`Pets found: ${pets.length}`);
        pets.forEach(p => {
            console.log(`[PET] ${p.name} | ${p.type}`);
        });

    } catch (err) {
        console.error('Diagnostic error:', err);
    } finally {
        console.log('--- END DIAGNOSTIC ---');
        // Give time for stdout
        setTimeout(() => process.exit(0), 1000);
    }
}

checkRaw();
