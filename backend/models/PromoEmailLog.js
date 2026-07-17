const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PromoEmailLog = sequelize.define(
    'PromoEmailLog',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shape: {
        type: DataTypes.ENUM('circular', 'rectangle'),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('auto', 'manual'),
        allowNull: false,
      },
      sentById: {
        type: DataTypes.INTEGER,
        allowNull: true, 
      },
    },
    {
      tableName: 'PromoEmailLogs',
      timestamps: true,
    }
  );

  return PromoEmailLog;
};
