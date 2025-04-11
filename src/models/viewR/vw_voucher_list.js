"use strict";

module.exports = function (sequelize, DataTypes) {
  var voucherList = sequelize.define("vw_voucher_list", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    voucherid: { type: DataTypes.INTEGER },
    voucherno: { type: DataTypes.STRING },
    vouchernominal: { type: DataTypes.NUMERIC(16,5) },
    effectivedate: { type: DataTypes.DATEONLY },
    expireddate: { type: DataTypes.DATEONLY },
    salesstatus: { type: DataTypes.STRING },
    salesid: { type: DataTypes.INTEGER },
    memberid: { type: DataTypes.INTEGER },
    usedstatus: { type: DataTypes.STRING },
    usedid: { type: DataTypes.INTEGER },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE }
  }, {
      tableName: 'vw_voucher_list'
    }, {
      freezeTableName: true
    })
  return voucherList
}