"use strict";

module.exports = function(sequelize, DataTypes) {
  var IndentDetail = sequelize.define("vw_indent_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.DATE },
    duedate: { type: DataTypes.DATE },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    qty: { type: DataTypes.NUMERIC(16,0) },
    returqty: { type: DataTypes.NUMERIC(16,0) },
    receiveqty: { type: DataTypes.NUMERIC(16,0) },
    currqty: { type: DataTypes.NUMERIC(16,0) },
    price: { type: DataTypes.NUMERIC(16,2) },
    totalprice: { type: DataTypes.NUMERIC(16,2) },
    description: { type: DataTypes.STRING },
    createdby: { type: DataTypes.STRING(30) },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING(30) },
    updatedat: { type: DataTypes.DATE },
  }, {
    tableName: 'vw_indent_detail',
    timestamps: false,
    freezeTableName: true
  })
  return IndentDetail
}