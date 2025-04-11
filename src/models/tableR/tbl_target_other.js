module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbl_target_other", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    referenceid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typeval: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, { tableName: 'tbl_target_other', timestamps: false, freezeTable: true })
}
