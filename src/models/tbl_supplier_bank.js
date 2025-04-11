"use strict";

module.exports = function (sequelize, DataTypes) {
  var Bank = sequelize.define("tbl_supplier_bank", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bankId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    accountNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    accountName: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: 1
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
      tableName: 'tbl_supplier_bank'
    })

  return Bank
}