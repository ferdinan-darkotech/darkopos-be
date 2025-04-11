"use strict";

module.exports = function (sequelize, DataTypes) {
  var Bank = sequelize.define("tbl_bank", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    bankCode: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\- ]{3,60}$/i
      }
    },
    bankName: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-. ]{3,60}$/i
      }
    },
    chargeFee: {
      type: DataTypes.DECIMAL(12, 6),
      allowNull: true,
    },
    chargeFeePercent: {
      type: DataTypes.DECIMAL(12, 6),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '1'
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
      tableName: 'tbl_bank'
    })

  return Bank
}