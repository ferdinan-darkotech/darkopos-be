"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherPackageDetail = sequelize.define("vw_voucher_package_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    packagecode: { type: DataTypes.STRING },
    packagename: { type: DataTypes.STRING },
    packagedesc: { type: DataTypes.STRING },
    voucherid: { type: DataTypes.INTEGER },
    storeid: { type: DataTypes.INTEGER },
    vouchercode: { type: DataTypes.STRING },
    vouchername: { type: DataTypes.STRING },
    vouchertype: { type: DataTypes.STRING },
    vouchernominal: { type: DataTypes.NUMERIC(16,5) },
    serialcode: { type: DataTypes.STRING },
    seriallength: { type: DataTypes.NUMERIC(16,5) },
    serialfromno: { type: DataTypes.NUMERIC(16,5) },
    serialtono: { type: DataTypes.NUMERIC(16,5) },
    qty: { type: DataTypes.NUMERIC(16,5) },
    effectivedate: { type: DataTypes.DATEONLY },
    expireddate: { type: DataTypes.DATEONLY },
    active: { type: DataTypes.BOOLEAN },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE }
  }, {
      tableName: 'vw_voucher_package_detail'
    }, {
      freezeTableName: true,
      timestamps: false
    })
  return voucherPackageDetail
}