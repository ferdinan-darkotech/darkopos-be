"use strict";

module.exports = function (sequelize, DataTypes) {
  var Data = sequelize.define("vw_stock_variant_001", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    productParentId: { type: DataTypes.INTEGER },
    productParentCode: { type: DataTypes.STRING },
    productParentName: { type: DataTypes.STRING },
    productId: { type: DataTypes.INTEGER },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    categoryId: { type: DataTypes.INTEGER },
    brandId: { type: DataTypes.INTEGER },
    variantId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    deletedBy: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_stock_variant_001' })
  return Data
}
