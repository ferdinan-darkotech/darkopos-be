"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const AdjustDetail = sequelize.define("vw_adjust_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeId: { type: DataTypes.INTEGER },
    transNo: { type: DataTypes.STRING },
    transType: { type: DataTypes.STRING },
    productId: { type: DataTypes.INTEGER },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    adjInQty: { type: DataTypes.NUMERIC },
    adjOutQty: { type: DataTypes.NUMERIC },
    sellingPrice: { type: DataTypes.NUMERIC },
    recapDate: { type: DataTypes.DATE },
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
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_adjust_detail', freezeTableName: true, timestamps: false })

  return AdjustDetail
}