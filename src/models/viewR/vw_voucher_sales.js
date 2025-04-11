"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherHeaderSales = sequelize.define("vw_voucher_sales", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: { type: DataTypes.INTEGER },
    storename: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.DATEONLY },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    cashierid: { type: DataTypes.INTEGER },
    cashiername: { type: DataTypes.STRING },
    memo: { type: DataTypes.STRING },
    total: { type: DataTypes.NUMERIC(16,5) },
    paid: { type: DataTypes.NUMERIC(16,5) },
    change: { type: DataTypes.NUMERIC(16,5) },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE }
  }, {
      tableName: 'vw_voucher_sales'
    }, {
      freezeTableName: true
    })
  return voucherHeaderSales
}