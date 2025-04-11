"use strict";

module.exports = function(sequelize, DataTypes) {
  var IndentDetailSales = sequelize.define("vw_indent_detail_sales", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    transno: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    dpcost: { type: DataTypes.NUMERIC(19,2) },
    dpretur: { type: DataTypes.NUMERIC(19,2) },
    currdp: { type: DataTypes.NUMERIC(19,2) },
    qty: { type: DataTypes.NUMERIC(19,0) },
    returqty: { type: DataTypes.NUMERIC(19,0) },
    receiveqty: { type: DataTypes.NUMERIC(19,0) },
    currqty: { type: DataTypes.NUMERIC(19,0) } 
  }, {
    tableName: 'vw_indent_detail_sales',
    timestamps: false,
    freezeTableName: true
  })
  return IndentDetailSales
}