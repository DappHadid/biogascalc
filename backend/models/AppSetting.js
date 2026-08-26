const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AppSetting = sequelize.define(
    'AppSetting',
    {
      key: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'AppSettings',
      timestamps: true,
    }
  );

  return AppSetting;
};
