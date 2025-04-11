"use strict";

module.exports = function (sequelize, DataTypes) {
  const VoucherListProduct = sequelize.define("vw_voucher_register", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: { type: DataTypes.INTEGER },
    storename: { type: DataTypes.STRING },
    vouchercode: { type: DataTypes.STRING },
    vouchercode: { type: DataTypes.STRING },
    vouchername: { type: DataTypes.STRING },
    serialcode: { type: DataTypes.STRING },
    serialfromno: { type: DataTypes.NUMERIC },
    serialtono: { type: DataTypes.NUMERIC },
    seriallength: { type: DataTypes.NUMERIC },
    effectivedate: { type: DataTypes.DATEONLY },
    expireddate: { type: DataTypes.DATEONLY },
    vouchertype: { type: DataTypes.STRING },
    vouchernominal: { type: DataTypes.NUMERIC(16,5) },
    remarks: { type: DataTypes.STRING },
    browsedata: { type: DataTypes.BOOLEAN },
    allowedit: { type: DataTypes.BOOLEAN },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE },
    active: { type: DataTypes.BOOLEAN }
  }, {
      tableName: 'vw_voucher_register',
      freezeTableName: true
    })
  return VoucherListProduct
}