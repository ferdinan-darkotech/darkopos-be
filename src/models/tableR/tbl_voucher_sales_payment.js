"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherSalesPayment = sequelize.define("tbl_voucher_sales_payment", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paymentoptionid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    edcid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cardno: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cardname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    carddescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: false
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    printdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedby: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      tableName: 'tbl_voucher_sales_payment'
    }, {
      freezeTableName: true
    })
  return voucherSalesPayment
}