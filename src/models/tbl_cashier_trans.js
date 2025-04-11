"use strict";

module.exports = function (sequelize, DataTypes) {
  var CashierTrans = sequelize.define("tbl_cashier_trans", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cashierId: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_]{6,15}$/i
      }
    },
    period: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    shiftId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    counterId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    openingBalance: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    cashIn: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
      defaultValue: 0
    },
    cashOut: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
      defaultValue: 0
    },
    closingBalance: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    periodDesc: {
      type: DataTypes.STRING(30),
      allowNull: true
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
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_cashier_trans'
    })

  return CashierTrans
}