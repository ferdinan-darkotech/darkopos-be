"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwCashierTrans = sequelize.define("vw_cashier_trans", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    storeName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    cashierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cashierName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    period: {
      type: DataTypes.DATE,
      allowNull: false
    },
    shiftId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shiftName: {
      type: DataTypes.STRING(10),
    },
    counterId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    counterName: {
      type: DataTypes.STRING(10),
    },
    openingBalance: {
      type: DataTypes.DECIMAL(19, 2),
    },
    cashIn: {
      type: DataTypes.DECIMAL(19, 2),
    },
    cashOut: {
      type: DataTypes.DECIMAL(19, 2),
    },
    closingBalance: {
      type: DataTypes.DECIMAL(19, 2),
    },
    status: {
      type: DataTypes.STRING(2),
    },
    employeeName: {
      type: DataTypes.STRING(50),
    },
    isCashierActive: {
      type: DataTypes.BOOLEAN,
    },
    isEmployeeActive: {
      type: DataTypes.BOOLEAN,
    },
    createdBy: {
      type: DataTypes.STRING(30),
    },
    createdAt: {
      type: DataTypes.DATEONLY,
    },
    updatedBy: {
      type: DataTypes.STRING(30),
    },
    updatedAt: {
      type: DataTypes.DATEONLY,
    },
  }, {
      tableName: 'vw_cashier_trans'
    })

  return vwCashierTrans
}