module.exports = function (sequelize, DataTypes) {
  return sequelize.define('shared_users', {
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
    shared_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "그룹고유번호",
      references: {
        model: 'shared',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'shared_users',
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
        name: "FK_shared_users_user_id_users_hashed_email",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "FK_shared_users_shared_id_shared_id",
        using: "BTREE",
        fields: [
          { name: "shared_id" },
        ]
      },
    ]
  });
};
