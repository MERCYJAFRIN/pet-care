const { sequelize } = require('./src/models');

async function test() {
    try {
        console.log('Testing connection...');
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        console.log('Syncing models...');
        await sequelize.sync({ alter: true });
        console.log('Models synced.');

        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

test();
