module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbl_division", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    divcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },  
    divname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdby: { type: DataTypes.STRING(30), allowNull: false },
    createdat: { type: DataTypes.DATE, allowNull: false },
    updatedby: { type: DataTypes.STRING(30), allowNull: true },
    updatedat: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'tbl_division', freezeTableName: true, timestamps: false })
}
