"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwCashierUser = sequelize.define("vw_user_cashier", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cashierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    employeeName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cashierName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    period: {
      type: DataTypes.DATE,
      allowNull: false
    },
    openingCash: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: false
    },
    isCashierActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isEmployeeActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
    tableName: 'vw_user_cashier'
  })

  return vwCashierUser
}