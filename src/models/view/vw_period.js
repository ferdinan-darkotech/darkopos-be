"use strict";

module.exports = function (sequelize, DataTypes) {
  var Period = sequelize.define("vw_period", {
    storeCode: { type: DataTypes.STRING },
    storeName: { type: DataTypes.STRING },
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeId: { type: DataTypes.INTEGER },
    transNo: { type: DataTypes.STRING },
    startPeriod: { type: DataTypes.DATE },
    endPeriod: { type: DataTypes.DATE },
    memo: { type: DataTypes.STRING },
    active: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_period' })
  return Period
}
