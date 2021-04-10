const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('erd_commits', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    erd_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "erd 고유번호",
      references: {
        model: 'erds',
        key: 'id'
      }
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "erd의 json 데이터"
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "commit 생성자",
      references: {
        model: 'users',
        key: 'hashed_email'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "생성일",
      defaultValue: sequelize.literal('now()'),
    }
  }, {
    sequelize,
    tableName: 'erd_commits',
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
        name: "FK_erd_commits_erd_id_erds_id",
        using: "BTREE",
        fields: [
          { name: "erd_id" },
        ]
      },
    ]
  });
};
