"use strict";

module.exports = function (sequelize, DataTypes) {
  const VoucherListProduct = sequelize.define("vw_voucher_register_product", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    vouchercode: { type: DataTypes.STRING },
    vouchername: { type: DataTypes.STRING },
    vouchertype: { type: DataTypes.STRING },
    vouchernominal: { type: DataTypes.NUMERIC(16,5) },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE },
    active: { type: DataTypes.BOOLEAN }
  }, {
      tableName: 'vw_voucher_register_product',
      primaryKey: true
    })
  return VoucherListProduct
}