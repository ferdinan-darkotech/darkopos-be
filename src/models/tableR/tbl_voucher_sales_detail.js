"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherDetailSales = sequelize.define("tbl_voucher_sales_detail", {
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
    voucherid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    voucherno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vouchernominal: {
      type: DataTypes.NUMERIC(16,5),
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
      tableName: 'tbl_voucher_sales_detail'
    }, {
      freezeTableName: true
    })
  return voucherDetailSales
}