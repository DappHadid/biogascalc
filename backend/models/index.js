const { getSequelize } = require('../config/db');

let models = null;

function initModels() {
  if (models) return models;

  const sequelize = getSequelize();

  const User = require('./User')(sequelize);
  const Dome = require('./Dome')(sequelize);
  const Example = require('./Example')(sequelize);
  const { HowItWorksStep, FaqItem } = require('./HomepageContent')(sequelize);
  const UserActivity = require('./UserActivity')(sequelize);
  const AppSetting = require('./AppSetting')(sequelize);
  const PromoEmailLog = require('./PromoEmailLog')(sequelize);

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

  User.hasMany(UserActivity, { foreignKey: 'userId', as: 'activities' });
  UserActivity.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  User.hasMany(PromoEmailLog, { foreignKey: 'userId', as: 'promoEmails' });
  PromoEmailLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
  PromoEmailLog.belongsTo(User, { foreignKey: 'sentById', as: 'sender' });

  models = { User, Dome, Example, HowItWorksStep, FaqItem, UserActivity, AppSetting, PromoEmailLog };
  return models;
}

module.exports = new Proxy({}, {
  get(target, prop) {
    const m = initModels();
    return m[prop];
  },
});
