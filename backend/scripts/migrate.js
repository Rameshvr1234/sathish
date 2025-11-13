const { sequelize } = require('../models');

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync all models with database
    // Use { alter: true } to update existing tables without dropping them
    await sequelize.sync({ alter: true });
    console.log('✓ Database models synchronized successfully');

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrate();
