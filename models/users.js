module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    hashed_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      comment: '유저 구글이메일 해시값'
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '리프레시토큰'
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'hashed_email' },
        ]
      },
    ]
  });
};
