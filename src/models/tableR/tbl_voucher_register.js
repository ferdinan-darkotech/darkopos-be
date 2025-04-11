"use strict";

module.exports = function (sequelize, DataTypes) {
  const VoucherList = sequelize.define("tbl_voucher_register", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vouchercode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    vouchername: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serialcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    serialfromno: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: false
    },
    serialtono: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: false
    },
    seriallength: {
      type: DataTypes.NUMERIC(12,0),
      allowNull: false
    },
    effectivedate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    expireddate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    vouchertype: { type: DataTypes.STRING, allowNull: false },
    vouchernominal: { type: DataTypes.NUMERIC(16,5), allowNull: false, defaultValue: 0 },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
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
      tableName: 'tbl_voucher_register'
    })
  return VoucherList
}