"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwCashierTransRequest = sequelize.define("vw_cashier_trans_collapse", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeId: { type: DataTypes.INTEGER },
    storeName: { type: DataTypes.STRING },
    cashierId: { type: DataTypes.STRING },
    cashierName: { type: DataTypes.STRING },
    period: { type: DataTypes.DATE },
    shiftId: { type: DataTypes.INTEGER },
    shiftName: { type: DataTypes.STRING },
    counterId: { type: DataTypes.INTEGER },
    counterName: { type: DataTypes.STRING },
    openingBalance: { type: DataTypes.NUMERIC },
    cashIn: { type: DataTypes.NUMERIC },
    cashOut: { type: DataTypes.NUMERIC },
    closingBalance: { type: DataTypes.NUMERIC },
    status: { type: DataTypes.STRING },
    employeeName: { type: DataTypes.STRING },
    isCashierActive: { type: DataTypes.TINYINT },
    isEmployeeActive: { type: DataTypes.TINYINT },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    transNo: { type: DataTypes.STRING },
    transDate: { type: DataTypes.DATE },
    problemDesc: { type: DataTypes.STRING },
    actionDesc: { type: DataTypes.STRING }
  }, { tableName: 'vw_cashier_trans_collapse' })
  return vwCashierTransRequest
}
