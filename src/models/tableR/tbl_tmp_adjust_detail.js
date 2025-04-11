"use strict";

module.exports = function (sequelize, DataTypes) {
  const ApprovalAdjustDetail = sequelize.define("tbl_tmp_adjust_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    transno: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    adjinqty: { type: DataTypes.DECIMAL(19, 2) },
    adjoutqty: { type: DataTypes.DECIMAL(19, 2) },
    sellingprice: { type: DataTypes.DECIMAL(19, 2) },
    closed: { type: DataTypes.INTEGER },
    recapdate: { type: DataTypes.DATEONLY },
    refno: { type: DataTypes.STRING },
	  taxtype: { type: DataTypes.STRING },
	  taxval: { type: DataTypes.NUMERIC(16,2) },
	  discp01: { type: DataTypes.NUMERIC(16,2) },
	  discp02: { type: DataTypes.NUMERIC(16,2) },
	  discp03: { type: DataTypes.NUMERIC(16,2) },
	  discp04: { type: DataTypes.NUMERIC(16,2) },
	  discp05: { type: DataTypes.NUMERIC(16,2) },
	  discnominal: { type: DataTypes.NUMERIC(16,2) },
	  dpp: { type: DataTypes.NUMERIC(16,2) },
	  ppn: { type: DataTypes.NUMERIC(16,2) },
	  netto: { type: DataTypes.NUMERIC(16,2) },
	  rounding_netto: { type: DataTypes.NUMERIC(16,2) },
    createdby: { type: DataTypes.STRING },
    updatedby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedat: { type: DataTypes.DATE }
  }, { tableName: 'tbl_tmp_adjust_detail', freezeTableName: true, timestamps: false })

  ApprovalAdjustDetail.removeAttribute('id');
  return ApprovalAdjustDetail
}













