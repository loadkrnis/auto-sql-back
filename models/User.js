const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "idx"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "name"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "email"
    },
    provider: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "provider"
    },
    picture: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "picture"
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "create_at"
    }
  }, {
    sequelize,
    tableName: 'User',
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
    ]
  });
};
