"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherPackageDetail = sequelize.define("vw_voucher_package", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    packagecode: { type: DataTypes.STRING },
    packagename: { type: DataTypes.STRING },
    packagedesc: { type: DataTypes.STRING },
    packageprice: { type: DataTypes.NUMERIC(16,5) },
    packageactive: { type: DataTypes.BOOLEAN },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE }
  }, {
      tableName: 'vw_voucher_package'
    }, {
      freezeTableName: true,
      timestamps: false
    })
  return voucherPackageDetail
}