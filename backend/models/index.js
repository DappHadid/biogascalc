const { getSequelize } = require('../config/db');

let models = null;

function initModels() {
  if (models) return models;

  const sequelize = getSequelize();

  const User = require('./User')(sequelize);
  const Dome = require('./Dome')(sequelize);
  const Example = require('./Example')(sequelize);

  User.belongsToMany(Dome, {
    through: 'UserDomes',
    as: 'assignedDomes',
    foreignKey: 'userId',
    otherKey: 'domeId',
  });

  Dome.belongsToMany(User, {
    through: 'UserDomes',
    as: 'assignedUsers',
    foreignKey: 'domeId',
    otherKey: 'userId',
  });

  models = { User, Dome, Example };
  return models;
}

module.exports = new Proxy({}, {
  get(target, prop) {
    const m = initModels();
    return m[prop];
  },
});
