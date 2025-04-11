"use strict";

module.exports = function (sequelize, DataTypes) {
  const VoucherListService = sequelize.define("vw_voucher_register_service", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    vouchercode: { type: DataTypes.STRING },
    vouchername: { type: DataTypes.STRING },
    vouchertype: { type: DataTypes.STRING },
    vouchernominal: { type: DataTypes.NUMERIC(16,5) },
    serviceid: { type: DataTypes.INTEGER },
    servicecode: { type: DataTypes.STRING },
    servicename: { type: DataTypes.STRING },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE },
    active: { type: DataTypes.BOOLEAN }
  }, {
      tableName: 'vw_voucher_register_service',
      primaryKey: true
    })    
  return VoucherListService
}