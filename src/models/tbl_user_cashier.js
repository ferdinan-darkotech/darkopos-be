"use strict";

module.exports = function (sequelize, DataTypes) {
  var CashierUser = sequelize.define("tbl_user_cashier", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
      type: DataTypes.DATE,
      allowNull: false,
    },
    openingCash: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    active: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_user_cashier'
    }, {
      uniqueKeys: {
        counter_unique_key: {
          fields: ['cashierId']
        }
      }
    })

  return CashierUser
}