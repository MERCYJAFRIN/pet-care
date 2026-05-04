const { User } = require('./src/models');
const sequelize = require('./src/config/database');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll({
            attributes: ['firstName', 'lastName', 'email', 'role']
        });
        console.log('--- USER LIST ---');
        users.forEach(u => {
            console.log(`${u.firstName} ${u.lastName} (${u.email}) - ROLE: ${u.role}`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkUsers();
