const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { syncDB } = require('../config/db');
const { User } = require('../models');

const USERS_DATA = [
  {
    name: 'Budi Santoso',
    email: 'budi@example.com',
    password: 'User@123456',
    role: 'user',
  },
  {
    name: 'Siti Aminah',
    email: 'siti@example.com',
    password: 'User@123456',
    role: 'user',
  },
  {
    name: 'Andi Wijaya',
    email: 'andi@example.com',
    password: 'User@123456',
    role: 'user',
  },
];

const seedUsers = async () => {
  try {
    await syncDB();

    let created = 0;
    let skipped = 0;

    for (const userData of USERS_DATA) {
      const existing = await User.findOne({ where: { email: userData.email } });
      if (existing) {
        console.log(`   Skipped: ${userData.email} (already exists)`);
        skipped++;
        continue;
      }

      await User.create(userData);
      console.log(`   Created: ${userData.name} <${userData.email}>`);
      created++;
    }

    console.log(`\nUser seeding complete! Created: ${created}, Skipped: ${skipped}`);
    console.log(`   Default password: User@123456\n`);

    process.exit(0);
  } catch (error) {
    console.error('\nError seeding users:', error.message);
    process.exit(1);
  }
};

seedUsers();
