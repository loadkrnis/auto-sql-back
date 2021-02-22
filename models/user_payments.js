const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_payments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "유저해쉬이메일",
      references: {
        model: 'users',
        key: 'hashed_email'
      }
    },
    infomation: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "결제정보 (세분화 필요)"
    }
  }, {
    sequelize,
    tableName: 'user_payments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "FK_user_payments_user_id_users_hashed_email",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
