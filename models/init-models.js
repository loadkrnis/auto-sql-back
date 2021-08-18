const DataTypes = require('sequelize').DataTypes;
const _erd_commits = require('./erd_commits');
const _erds = require('./erds');
const _plan_infomations = require('./plan_infomations');
const _shared = require('./shared');
const _shared_erds = require('./shared_erds');
const _shared_users = require('./shared_users');
const _user_payments = require('./user_payments');
const _user_plans = require('./user_plans');
const _users = require('./users');

function initModels(sequelize) {
  const erd_commits = _erd_commits(sequelize, DataTypes);
  const erds = _erds(sequelize, DataTypes);
  const plan_infomations = _plan_infomations(sequelize, DataTypes);
  const shared = _shared(sequelize, DataTypes);
  const shared_erds = _shared_erds(sequelize, DataTypes);
  const shared_users = _shared_users(sequelize, DataTypes);
  const user_payments = _user_payments(sequelize, DataTypes);
  const user_plans = _user_plans(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  erd_commits.belongsTo(erds, { as: 'erd', foreignKey: 'erd_id' });
  erds.hasMany(erd_commits, { as: 'erd_commits', foreignKey: 'erd_id' });
  shared_erds.belongsTo(erds, { as: 'erd', foreignKey: 'erd_id' });
  erds.hasMany(shared_erds, { as: 'shared_erds', foreignKey: 'erd_id' });
  user_plans.belongsTo(plan_infomations, { as: 'info', foreignKey: 'info_id' });
  plan_infomations.hasMany(user_plans, { as: 'user_plans', foreignKey: 'info_id' });
  shared_erds.belongsTo(shared, { as: 'shared', foreignKey: 'shared_id' });
  shared.hasMany(shared_erds, { as: 'shared_erds', foreignKey: 'shared_id' });
  shared_users.belongsTo(shared, { as: 'shared', foreignKey: 'shared_id' });
  shared.hasMany(shared_users, { as: 'shared_users', foreignKey: 'shared_id' });
  erds.belongsTo(users, { as: 'user', foreignKey: 'user_id' });
  users.hasMany(erds, { as: 'erds', foreignKey: 'user_id' });
  shared.belongsTo(users, { as: 'user', foreignKey: 'user_id' });
  users.hasMany(shared, { as: 'shareds', foreignKey: 'user_id' });
  shared_users.belongsTo(users, { as: 'user', foreignKey: 'user_id' });
  users.hasMany(shared_users, { as: 'shared_users', foreignKey: 'user_id' });
  user_payments.belongsTo(users, { as: 'user', foreignKey: 'user_id' });
  users.hasMany(user_payments, { as: 'user_payments', foreignKey: 'user_id' });
  user_plans.belongsTo(users, { as: 'user', foreignKey: 'user_id' });
  users.hasMany(user_plans, { as: 'user_plans', foreignKey: 'user_id' });
  erd_commits.belongsTo(users, { as: 'user', foreignKey: 'user_id' });
  users.hasMany(erd_commits, { as: 'erd_commits', foreignKey: 'user_id' });
  return {
    erd_commits,
    erds,
    plan_infomations,
    shared,
    shared_erds,
    shared_users,
    user_payments,
    user_plans,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
