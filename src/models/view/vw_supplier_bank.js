"use strict";

module.exports = function (sequelize, DataTypes) {
  var Data = sequelize.define(
    "vw_supplier_bank", {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      supplierId: { type: DataTypes.INTEGER },
      supplierCode: { type: DataTypes.STRING },
      supplierName: { type: DataTypes.STRING },
      accountNo: { type: DataTypes.STRING },
      accountName: { type: DataTypes.STRING },
      bankId: { type: DataTypes.INTEGER },
      bankCode: { type: DataTypes.STRING },
      bankName: { type: DataTypes.STRING },
      chargeFee: { type: DataTypes.NUMERIC },
      chargeFeePercent: { type: DataTypes.NUMERIC },
      status: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.DATE },
      updatedBy: { type: DataTypes.STRING },
      updatedAt: { type: DataTypes.DATE }
    },
    {
      tableName: 'vw_supplier_bank'
    })
  return Data
}
