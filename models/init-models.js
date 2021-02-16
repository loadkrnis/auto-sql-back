var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _User = require("./User");
var _erd = require("./erd");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);
  var erd = _erd(sequelize, DataTypes);

  erd.belongsTo(User, { as: "user_idx_User", foreignKey: "user_idx"});
  User.hasMany(erd, { as: "erds", foreignKey: "user_idx"});

  return {
    SequelizeMeta,
    User,
    erd,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
