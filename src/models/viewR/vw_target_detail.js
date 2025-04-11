"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_target_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    referenceId: { type: DataTypes.INTEGER },
    storeCode: { type: DataTypes.STRING },
    storeName: { type: DataTypes.STRING },
    categoryCode: { type: DataTypes.STRING },
    categoryName: { type: DataTypes.STRING },
    brandCode: { type: DataTypes.STRING },
    brandName: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATE },
    endDate: { type: DataTypes.DATE },
    targetSalesQty: { type: DataTypes.INTEGER },
    targetSalesValue: { type: DataTypes.INTEGER }
  }, { tableName: 'vw_target_detail' })
}