"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherDetailSales = sequelize.define("vw_voucher_sales_item", {
    storeid: { type: DataTypes.INTEGER },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    serialcode: { type: DataTypes.STRING },
    voucherid: { type: DataTypes.INTEGER },
    vouchercode: { type: DataTypes.STRING },
    voucherno: { type: DataTypes.STRING },
    vouchertype: { type: DataTypes.STRING },
    vouchernominal: { type: DataTypes.NUMERIC(16,5) },
    effectivedate: { type: DataTypes.DATEONLY },
    expireddate: { type: DataTypes.DATEONLY },
    usedstatus: { type: DataTypes.STRING },
    salesstatus: { type: DataTypes.STRING },
    itemid: { type: DataTypes.INTEGER },
    itemcode: { type: DataTypes.STRING },
    itemname: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN },
    typeCode: { type: DataTypes.STRING }
  }, {
      tableName: 'vw_voucher_sales_item'
    }, {
      freezeTableName: true,
      timestamps: false
    })
  return voucherDetailSales
}