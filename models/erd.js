const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('erd', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "idx"
    },
    user_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "user_idx",
      references: {
        model: 'User',
        key: 'idx'
      }
    },
    erd_json: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "erd_json"
    },
    database_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "database_name"
    }
  }, {
    sequelize,
    tableName: 'erd',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idx" },
        ]
      },
      {
        name: "FK_erd_user_idx_User_idx",
        using: "BTREE",
        fields: [
          { name: "user_idx" },
        ]
      },
    ]
  });
};
