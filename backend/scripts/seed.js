const { sequelize, User, Branch } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({
      where: { role: 'super_admin' }
    });

    if (existingSuperAdmin) {
      console.log('ℹ️  Super admin already exists. Skipping seed.');
      process.exit(0);
    }

    // Create Super Admin
    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD || 'Admin@123456',
      10
    );

    const superAdmin = await User.create({
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@propertyportal.com',
      password: hashedPassword,
      full_name: 'Super Administrator',
      phone: '9999999999',
      role: 'super_admin',
      is_verified: true,
      status: 'active'
    });

    console.log('✓ Super admin created:', superAdmin.email);

    // Create default main branch
    const mainBranch = await Branch.create({
      name: 'Main Branch',
      code: 'MAIN',
      address: 'Headquarters',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      phone: '1800-123-4567',
      email: 'main@propertyportal.com',
      status: 'active',
      is_headquarters: true
    });

    console.log('✓ Main branch created:', mainBranch.name);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📧 Super Admin Credentials:');
    console.log('   Email:', superAdmin.email);
    console.log('   Password:', process.env.SUPER_ADMIN_PASSWORD || 'Admin@123456');
    console.log('\n⚠️  Please change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seed();
