"use strict";

module.exports = function (sequelize, DataTypes) {
  var Data = sequelize.define("vw_cash_entry_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    transNoId: { type: DataTypes.INTEGER },
    accountId: { type: DataTypes.INTEGER },
    accountDetailCode: { type: DataTypes.STRING },
    accountName: { type: DataTypes.STRING },
    amountIn: { type: DataTypes.NUMERIC },
    amountOut: { type: DataTypes.NUMERIC },
    description: { type: DataTypes.STRING },
    storeId: { type: DataTypes.INTEGER },
    transNo: { type: DataTypes.STRING },
    transDate: { type: DataTypes.DATE },
    reference: { type: DataTypes.STRING },
    supplierId: { type: DataTypes.INTEGER },
    supplierCode: { type: DataTypes.STRING },
    supplierName: { type: DataTypes.STRING },
    memberId: { type: DataTypes.INTEGER },
    memberCode: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    cashierTransId: { type: DataTypes.INTEGER },
    cashierId: { type: DataTypes.STRING },
    period: { type: DataTypes.DATE },
    status: { type: DataTypes.STRING },
  }, { tableName: 'vw_cash_entry_detail' })
  return Data
}
