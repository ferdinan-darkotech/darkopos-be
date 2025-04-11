"use strict";

module.exports = function (sequelize, DataTypes) {
  var Data = sequelize.define("vw_stock_specification", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    productId: { type: DataTypes.INTEGER },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    categoryId: { type: DataTypes.INTEGER },
    categoryCode: { type: DataTypes.STRING },
    categoryName: { type: DataTypes.STRING },
    brandId: { type: DataTypes.INTEGER },
    specificationId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    deletedBy: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_stock_specification' })
  return Data
}
