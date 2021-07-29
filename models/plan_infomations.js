module.exports = function (sequelize, DataTypes) {
  return sequelize.define('plan_infomations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "서비스 등급"
    },
    infomation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "서비스 등급에 따른 제약사항을 기술한 컬럼 ( 또는 제약사항을 쉽게 파악할수 있도록 세분화 시켜야함 )"
    }
  }, {
    sequelize,
    tableName: 'plan_infomations',
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
    ]
  });
};
