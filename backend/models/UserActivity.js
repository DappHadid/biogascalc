const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserActivity = sequelize.define(
    'UserActivity',
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
      action: {
        type: DataTypes.ENUM('visualize_circular', 'visualize_rectangle'),
        allowNull: false,
      },
    },
    {
      tableName: 'UserActivities',
      indexes: [
        { fields: ['userId'] },
        { fields: ['action'] },
      ],
    }
  );

  return UserActivity;
};
