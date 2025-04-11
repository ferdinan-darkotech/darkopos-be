"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherHeaderSales = sequelize.define("tbl_voucher_sales", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    packagecode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    memberid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cashierid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    total: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: false
    },
    paid: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: false
    },
    change: {
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
      tableName: 'tbl_voucher_sales'
    }, {
      freezeTableName: true
    })
  return voucherHeaderSales
}