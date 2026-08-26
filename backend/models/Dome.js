const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Dome = sequelize.define('Dome', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nama lokasi wajib diisi' },
        len: { args: [1, 200], msg: 'Nama maksimal 200 karakter' },
      },
    },
    city: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Kota wajib diisi' },
        len: { args: [1, 150], msg: 'Kota maksimal 150 karakter' },
      },
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isFloat: { msg: 'Latitude harus berupa angka' },
      },
    },
    lng: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isFloat: { msg: 'Longitude harus berupa angka' },
      },
    },
    type: {
      type: DataTypes.ENUM('Peternakan', 'Perkebunan', 'Industri', 'Komunitas'),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Tipe wajib diisi' },
      },
    },
    limbahPerHari: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Limbah per hari tidak boleh negatif' },
      },
    },
    potensiGas: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Potensi gas tidak boleh negatif' },
      },
    },
    diameter: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Diameter tidak boleh negatif' },
      },
    },
    tinggi: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Tinggi tidak boleh negatif' },
      },
    },
    status: {
      type: DataTypes.ENUM('Aktif', 'Potensi'),
      defaultValue: 'Potensi',
    },
  });

  return Dome;
};
