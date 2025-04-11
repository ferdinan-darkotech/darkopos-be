"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherPackage = sequelize.define("tbl_voucher_package", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    packagecode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    packagename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    packagedesc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    packageprice: {
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
      tableName: 'tbl_voucher_package'
    }, {
      freezeTableName: true,
      timestamps: false
    })
  return voucherPackage
}