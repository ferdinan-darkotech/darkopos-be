"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherPayment = sequelize.define("vw_voucher_sales_payment", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: { type: DataTypes.INTEGER },
    transno: { type: DataTypes.STRING },
    paymentoptionid: { type: DataTypes.INTEGER },
    edcid: { type: DataTypes.INTEGER },
    cardno: { type: DataTypes.STRING },
    cardname: { type: DataTypes.STRING },
    cardinfo: { type: DataTypes.STRING },
    carddescription: { type: DataTypes.STRING },
    cardno: { type: DataTypes.NUMERIC(16,5) },
    memo: { type: DataTypes.STRING },
    printdate: { type: DataTypes.DATE },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE }
  }, {
      tableName: 'vw_voucher_sales_payment'
    }, {
      freezeTableName: true
    })
  return voucherPayment
}