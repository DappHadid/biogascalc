const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HowItWorksStep = sequelize.define(
    'HowItWorksStep',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stepNumber: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Nomor langkah wajib diisi' },
        },
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Judul langkah wajib diisi' },
          len: { args: [1, 150], msg: 'Judul maksimal 150 karakter' },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Deskripsi wajib diisi' },
        },
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'HowItWorksSteps',
    }
  );

  const FaqItem = sequelize.define(
    'FaqItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category: {
        type: DataTypes.ENUM('Umum', 'Teknis & Fitur', 'Langkah Selanjutnya'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['Umum', 'Teknis & Fitur', 'Langkah Selanjutnya']],
            msg: 'Kategori harus salah satu dari: Umum, Teknis & Fitur, Langkah Selanjutnya',
          },
        },
      },
      question: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Pertanyaan wajib diisi' },
          len: { args: [1, 500], msg: 'Pertanyaan maksimal 500 karakter' },
        },
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Jawaban wajib diisi' },
        },
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'FaqItems',
    }
  );

  return { HowItWorksStep, FaqItem };
};
