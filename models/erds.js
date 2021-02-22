const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('erds', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "erd 이름"
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "생성자의 유저해쉬이메일",
      references: {
        model: 'users',
        key: 'hashed_email'
      }
    }
  }, {
    sequelize,
    tableName: 'erds',
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
        name: "FK_erds_user_id_users_hashed_email",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
