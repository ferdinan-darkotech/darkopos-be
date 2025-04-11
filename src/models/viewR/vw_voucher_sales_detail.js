"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherDetailSales = sequelize.define("vw_voucher_sales_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: { type: DataTypes.INTEGER },
    transno: { type: DataTypes.STRING },
    voucherid: { type: DataTypes.INTEGER },
    voucherno: { type: DataTypes.STRING },
    vouchernominal: { type: DataTypes.NUMERIC(16,5) },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE }
  }, {
      tableName: 'vw_voucher_sales_detail'
    }, {
      freezeTableName: true
    })
  return voucherDetailSales
}