"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherPackageDetail = sequelize.define("tbl_voucher_package_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    packagecode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    voucherid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: false
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
      tableName: 'tbl_voucher_package_detail'
    }, {
      freezeTableName: true,
      timestamps: false
    })
  return voucherPackageDetail
}