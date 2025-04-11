"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwCashierTransLog = sequelize.define("vw_cashier_trans_request", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeId: { type: DataTypes.INTEGER },
    transNo: { type: DataTypes.STRING },
    transDate: { type: DataTypes.DATE },
    cashierTransId: { type: DataTypes.INTEGER },
    previousValue: { type: DataTypes.STRING },
    newValue: { type: DataTypes.STRING },
    problemDesc: { type: DataTypes.STRING },
    actionDesc: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    cashRegisterStore: { type: DataTypes.INTEGER}
  }, { tableName: 'vw_cashier_trans_request' })
  return vwCashierTransLog
}
