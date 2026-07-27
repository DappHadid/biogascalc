const { Sequelize } = require('sequelize');

let sequelize;

const getSequelize = () => {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        define: {
          timestamps: true,
          underscored: false,
        },
      }
    );
  }
  return sequelize;
};

const syncDB = async () => {
  try {
    const seq = getSequelize();
    await seq.authenticate();
    console.log(`MySQL Connected: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);

    const models = require('../models');
    void models.User;
    void models.HowItWorksStep;
    void models.FaqItem;
    void models.UserActivity;
    void models.AppSetting;
    void models.PromoEmailLog;

    await seq.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database tables synchronized.');

    const userCount = await models.User.count();
    if (userCount === 0) {
      console.log('No users found in database. Seeding initial Super Admin...');
      await models.User.create({
        name: 'Super Administrator',
        email: 'superadmin@biogascalc.com',
        password: 'SuperAdmin@123456',
        role: 'superadmin',
      });
      console.log('Super Admin seeded successfully! Email: superadmin@biogascalc.com');
    }

    const stepsCount = await models.HowItWorksStep.count();
    if (stepsCount === 0) {
      console.log('Seeding default How It Works steps...');
      await models.HowItWorksStep.bulkCreate([
        {
          stepNumber: '01',
          title: 'Masukkan Data Limbah',
          description: 'Input jenis dan berat limbah organik harian yang tersedia (kg/hari).',
          sortOrder: 0,
        },
        {
          stepNumber: '02',
          title: 'Sistem Menghitung Potensi',
          description: 'Kalkulator memproses data menggunakan rasio produksi biogas berbasis riset.',
          sortOrder: 1,
        },
        {
          stepNumber: '03',
          title: 'Lihat Estimasi Biogas',
          description: 'Dapatkan hasil estimasi volume biogas (m³/hari) beserta rekomendasi ukuran dome.',
          sortOrder: 2,
        },
        {
          stepNumber: '04',
          title: 'Rancang Reaktor Anda',
          description: 'Gunakan hasil perhitungan untuk merancang dan membangun reaktor biogas sendiri.',
          sortOrder: 3,
        },
      ]);
      console.log('How It Works steps seeded successfully!');
    }

    const faqCount = await models.FaqItem.count();
    if (faqCount === 0) {
      console.log('Seeding default FAQ items...');
      await models.FaqItem.bulkCreate([
        {
          category: 'Umum',
          question: 'Apa itu BioGasCalc?',
          answer: 'BioGasCalc adalah kalkulator berbasis web untuk mengestimasi potensi produksi biogas dari limbah organik, sekaligus membantu merancang ukuran reaktor dome yang sesuai.',
          sortOrder: 0,
        },
        {
          category: 'Umum',
          question: 'Apakah alat ini gratis digunakan?',
          answer: 'Ya, seluruh fitur kalkulator dan perancangan dome dapat digunakan tanpa biaya sebagai bagian dari Program Kreativitas Mahasiswa (PKM).',
          sortOrder: 1,
        },
        {
          category: 'Teknis & Fitur',
          question: 'Jenis limbah apa saja yang bisa dihitung?',
          answer: 'Kalkulator mendukung berbagai jenis limbah organik rumah tangga dan peternakan, seperti sisa makanan, kotoran ternak, dan limbah sayuran.',
          sortOrder: 0,
        },
        {
          category: 'Teknis & Fitur',
          question: 'Seberapa akurat estimasi yang dihasilkan?',
          answer: 'Estimasi dihitung berdasarkan rasio produksi biogas dari data riset yang telah divalidasi, namun hasil aktual di lapangan dapat bervariasi tergantung kondisi reaktor dan lingkungan.',
          sortOrder: 1,
        },
        {
          category: 'Langkah Selanjutnya',
          question: 'Bagaimana cara memulai membangun reaktor dome?',
          answer: 'Setelah mendapatkan hasil estimasi dari kalkulator, Anda dapat menggunakan fitur Rancang Dome untuk memperoleh rekomendasi ukuran dan spesifikasi reaktor.',
          sortOrder: 0,
        },
      ]);
      console.log('FAQ items seeded successfully!');
    }

    const settingsCount = await models.AppSetting.count();
    if (settingsCount === 0) {
      console.log('Seeding default app settings...');
      await models.AppSetting.bulkCreate([
        { key: 'MAX_VOLUME_GUEST', value: '5', description: 'Maximum dome volume for non-logged-in users (m3)' },
        { key: 'MAX_VOLUME_USER', value: '40', description: 'Maximum dome volume for logged-in users (m3)' },
        { key: 'EMAIL_PROMO_THRESHOLD', value: '5', description: 'Activity count multiple required to trigger automated promo emails' },
        { key: 'ADMIN_CONTACT_EMAIL', value: 'superadmin@biogascalc.com', description: 'Admin contact email shown to users when volume limit is exceeded' },
      ]);
      console.log('App settings seeded successfully!');
    } else {
      const promoSetting = await models.AppSetting.findByPk('EMAIL_PROMO_THRESHOLD');
      if (!promoSetting) {
        await models.AppSetting.create({
          key: 'EMAIL_PROMO_THRESHOLD',
          value: '5',
          description: 'Activity count multiple required to trigger automated promo emails'
        });
      }
      const contactSetting = await models.AppSetting.findByPk('ADMIN_CONTACT_EMAIL');
      if (!contactSetting) {
        await models.AppSetting.create({
          key: 'ADMIN_CONTACT_EMAIL',
          value: 'superadmin@biogascalc.com',
          description: 'Admin contact email shown to users when volume limit is exceeded'
        });
      }
    }

  } catch (error) {
    console.error(`MySQL Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { getSequelize, syncDB };
