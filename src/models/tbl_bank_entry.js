"use strict";

module.exports = function (sequelize, DataTypes) {
  var Cash = sequelize.define("tbl_bank_entry", {
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
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    transDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    reference: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    cashierTransId: {
      type: DataTypes.INTEGER
    },
    transType: {
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '1'
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
      tableName: 'tbl_bank_entry'
    })

  return Cash
}
