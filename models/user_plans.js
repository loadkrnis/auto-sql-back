const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_plans', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "유저해쉬이메일",
      references: {
        model: 'users',
        key: 'hashed_email'
      }
    },
    info_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "서비스 정보의 고유번호",
      references: {
        model: 'plan_infomations',
        key: 'id'
      }
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "서비스 만료일"
    }
  }, {
    sequelize,
    tableName: 'user_plans',
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
        name: "FK_user_plans_info_id_plan_infomations_id",
        using: "BTREE",
        fields: [
          { name: "info_id" },
        ]
      },
      {
        name: "FK_user_plans_user_id_users_hashed_email",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
