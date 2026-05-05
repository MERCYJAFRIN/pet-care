const { Sequelize } = require('sequelize');
const path = require('path');

// Using SQLite as H2 alternative (H2 is Java-based)
// For production H2, use H2 server instance
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
      }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../data/petcare.db'),
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
      },
      foreignKeys: false,
    });

// Disable foreign key constraints in SQLite
sequelize.afterConnect((connection, config) => {
  // Disable foreign keys for SQLite
  if (config.dialect === 'sqlite') {
    connection.run('PRAGMA foreign_keys = OFF');
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('✓ Database connection established successfully');
    // Disable foreign keys after connecting
    return sequelize.query('PRAGMA foreign_keys = OFF');
  })
  .then(() => {
    console.log('✓ Foreign keys disabled for SQLite');
  })
  .catch(err => {
    console.error('✗ Unable to connect to the database:', err);
  });

module.exports = sequelize;
