"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwiProductPrice001 = sequelize.define("vwi_product_price", {
    productId: { type: DataTypes.INTEGER },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    barcode01: { type: DataTypes.STRING },
    barcode02: { type: DataTypes.STRING },
    otherName01: { type: DataTypes.STRING },
    otherName02: { type: DataTypes.STRING },
    location01: { type: DataTypes.STRING },
    location02: { type: DataTypes.STRING },
    costPrice: { type: DataTypes.NUMERIC },
    sellPrice: { type: DataTypes.NUMERIC },
    sellPricePre: { type: DataTypes.NUMERIC },
    distPrice01: { type: DataTypes.NUMERIC },
    distPrice02: { type: DataTypes.NUMERIC },
    brandId: { type: DataTypes.INTEGER },
    categoryId: { type: DataTypes.INTEGER },
    trackQty: { type: DataTypes.TINYINT },
    alertQty: { type: DataTypes.NUMERIC },
    active: { type: DataTypes.INTEGER },
    activeStatus: { type: DataTypes.STRING },
    exception01: { type: DataTypes.TINYINT },
    usageTimePeriod: { type: DataTypes.INTEGER },
    usageMileage: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    storeId: { type: DataTypes.INTEGER },
    costPriceLocal: { type: DataTypes.NUMERIC },
    sellPriceLocal: { type: DataTypes.NUMERIC },
    sellPricePreLocal: { type: DataTypes.NUMERIC },
    distPrice01Local: { type: DataTypes.NUMERIC },
    distPrice02Local: { type: DataTypes.NUMERIC },
    createdByLocal: { type: DataTypes.STRING },
    createdAtLocal: { type: DataTypes.DATE },
    updatedByLocal: { type: DataTypes.STRING },
    updatedAtLocal: { type: DataTypes.DATE }
  }, { tableName: 'vwi_product_price' })
  return vwiProductPrice001
}
