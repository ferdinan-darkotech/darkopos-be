"use strict";

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("vwd_change_sellprice", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    transNoId: { type: DataTypes.INTEGER },
    transNo: { type: DataTypes.STRING },
    period: { type: DataTypes.STRING },
    year: { type: DataTypes.STRING },
    transDate: { type: DataTypes.DATE },
    status: { type: DataTypes.STRING },
    productId: { type: DataTypes.INTEGER },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    prevSellPrice: { type: DataTypes.NUMERIC },
    prevDistPrice01: { type: DataTypes.NUMERIC },
    prevDistPrice02: { type: DataTypes.NUMERIC },
    sellPrice: { type: DataTypes.NUMERIC },
    distPrice01: { type: DataTypes.NUMERIC },
    distPrice02: { type: DataTypes.NUMERIC },
    categoryId: { type: DataTypes.INTEGER },
    categoryName: { type: DataTypes.STRING },
    brandId: { type: DataTypes.INTEGER },
    brandName: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vwd_change_sellprice' })
  return Pos
}
