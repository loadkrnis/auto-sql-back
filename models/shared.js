module.exports = function (sequelize, DataTypes) {
  return sequelize.define('shared', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: '고유번호'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '그룹이름'
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '마스터',
      references: {
        model: 'users',
        key: 'hashed_email'
      }
    }
  }, {
    sequelize,
    tableName: 'shared',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' },
        ]
      },
      {
        name: 'FK_shared_user_id_users_hashed_email',
        using: 'BTREE',
        fields: [
          { name: 'user_id' },
        ]
      },
    ]
  });
};
