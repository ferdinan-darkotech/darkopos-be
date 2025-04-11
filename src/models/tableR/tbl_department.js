module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbl_department", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    deptcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },  
    deptname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdby: { type: DataTypes.STRING(30), allowNull: false },
    createdat: { type: DataTypes.DATE, allowNull: false },
    updatedby: { type: DataTypes.STRING(30), allowNull: true },
    updatedat: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'tbl_department', freezeTableName: true, timestamps: false })
}
