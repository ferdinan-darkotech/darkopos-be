"use strict";

module.exports = function (sequelize, DataTypes) {
  var CashRegisterRequest = sequelize.define("tbl_cashier_trans_request", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    transDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cashierTransId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    previousValue: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue('previousValue'));
      },
      set: function(value) {
        this.setDataValue('previousValue', JSON.stringify(value));
      }
    },
    newValue: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue('newValue'));
      },
      set: function(value) {
        this.setDataValue('newValue', JSON.stringify(value));
      }
    },
    problemDesc: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    actionDesc: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
  }, {
      tableName: 'tbl_cashier_trans_request'
    })

  return CashRegisterRequest
}