const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Nama wajib diisi' },
          len: { args: [1, 100], msg: 'Nama maksimal 100 karakter' },
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: { msg: 'Email sudah terdaftar' },
        validate: {
          isEmail: { msg: 'Format email tidak valid' },
          notEmpty: { msg: 'Email wajib diisi' },
        },
        set(value) {
          this.setDataValue('email', value ? value.toLowerCase().trim() : value);
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Password wajib diisi' },
          len: { args: [8, 255], msg: 'Password minimal 8 karakter' },
        },
      },
      role: {
        type: DataTypes.ENUM('user', 'admin', 'superadmin'),
        defaultValue: 'user',
      },
    },
    {
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  );

  User.beforeCreate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.prototype.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  };

  return User;
};
