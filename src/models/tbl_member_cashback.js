"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_member_cashback", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(1),
      allowNull: false,
      comment: 'N=New Member; I=Masuk dari penjualan; O=Keluar dari penjualan'
    },
    loyaltyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    posId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    transDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    minPayment: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maxDiscount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loyaltySetValue: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    cashbackIn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cashbackOut: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    memo: {
      type: DataTypes.STRING(50),
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
    },
    deletedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_member_cashback'
    })

  return Table
}