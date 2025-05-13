"use strict";

module.exports = function (sequelize, DataTypes) {
  var Cash = sequelize.define("tbl_bank_entry_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    transNoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amountIn: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true
    },
    amountOut: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
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
      tableName: 'tbl_bank_entry_detail'
    })
  return Cash
}
