const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { syncDB } = require('../config/db');
const { User } = require('../models');

const ADMIN_DATA = {
  name: 'Administrator',
  email: 'admin@biogascalc.com',
  password: 'Admin@123456',
  role: 'admin',
};

const seedAdmin = async () => {
  try {
    await syncDB();

    const existing = await User.findOne({ where: { email: ADMIN_DATA.email } });
    if (existing) {
      console.log('\nAdmin account already exists:');
      console.log(`   Email: ${existing.email}`);
      console.log(`   Role:  ${existing.role}`);
      console.log('   Skipping creation.\n');
      process.exit(0);
    }

    const admin = await User.create(ADMIN_DATA);
    console.log('\nAdmin account created successfully!');
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role:  ${admin.role}`);
    console.log(`   Password: Admin@123456\n`);

    process.exit(0);
  } catch (error) {
    console.error('\nError seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
