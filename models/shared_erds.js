module.exports = function (sequelize, DataTypes) {
  return sequelize.define('shared_erds', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    shared_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "그룹고유번호",
      references: {
        model: 'shared',
        key: 'id'
      }
    },
    erd_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "erd 고유번호",
      references: {
        model: 'erds',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'shared_erds',
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
        name: "FK_shared_erds_shared_id_shared_id",
        using: "BTREE",
        fields: [
          { name: "shared_id" },
        ]
      },
      {
        name: "FK_shared_erds_erd_id_erds_id",
        using: "BTREE",
        fields: [
          { name: "erd_id" },
        ]
      },
    ]
  });
};
