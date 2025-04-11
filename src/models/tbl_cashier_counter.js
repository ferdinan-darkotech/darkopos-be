"use strict";

module.exports = function(sequelize, DataTypes) {
  var CashierCounter = sequelize.define("tbl_cashier_counter", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    counterName: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    counterDesc: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tbl_cashier_counter'
  }, {
    uniqueKeys: {
      counter_unique_key: {
        fields: ['counterName']
      }
    }
  })

  return CashierCounter
}