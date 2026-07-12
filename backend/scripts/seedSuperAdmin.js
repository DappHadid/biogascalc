const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { syncDB } = require('../config/db');
const { User } = require('../models');

const SUPER_ADMIN_DATA = {
  name: 'Super Administrator',
  email: 'superadmin@biogascalc.com',
  password: 'SuperAdmin@123456',
  role: 'superadmin',
};

const seedSuperAdmin = async () => {
  try {
    await syncDB();

    const existing = await User.findOne({ where: { email: SUPER_ADMIN_DATA.email } });
    if (existing) {
      console.log('\nSuper Admin account already exists:');
      console.log(`   Email: ${existing.email}`);
      console.log(`   Role:  ${existing.role}`);
      console.log('   Skipping creation.\n');
      process.exit(0);
    }

    const superAdmin = await User.create(SUPER_ADMIN_DATA);
    console.log('\nSuper Admin account created successfully!');
    console.log(`   Name:     ${superAdmin.name}`);
    console.log(`   Email:    ${superAdmin.email}`);
    console.log(`   Role:     ${superAdmin.role}`);
    console.log(`   Password: SuperAdmin@123456\n`);

    process.exit(0);
  } catch (error) {
    console.error('\nError seeding super admin:', error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
