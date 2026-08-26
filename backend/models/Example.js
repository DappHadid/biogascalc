const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Example = sequelize.define('Example', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' },
      },
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    value: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Example;
};
