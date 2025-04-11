"use strict";

module.exports = function(sequelize, DataTypes) {
  var IndentDetailCancel = sequelize.define("vw_indent_detail_cancel", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cancelno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.DATE },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    returqty: { type: DataTypes.NUMERIC(16,0) },
    cancelby: { type: DataTypes.STRING(30) },
    cancelat: { type: DataTypes.DATE }
  }, {
    tableName: 'vw_indent_detail_cancel',
    timestamps: false,
    freezeTableName: true
  })
  return IndentDetailCancel
}