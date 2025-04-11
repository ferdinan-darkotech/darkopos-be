"use strict";

//add another fields
module.exports = function (sequelize, DataTypes) {
  var vwiProduct001 = sequelize.define("vw_product", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    productParentId: { type: DataTypes.INTEGER },
    variantId: { type: DataTypes.INTEGER },
    barCode01: { type: DataTypes.STRING },
    barCode02: { type: DataTypes.STRING },
    otherName01: { type: DataTypes.STRING },
    otherName02: { type: DataTypes.STRING },
    location01: { type: DataTypes.STRING },
    location02: { type: DataTypes.STRING },
    costPrice: { type: DataTypes.NUMERIC },
    sellPrice: { type: DataTypes.NUMERIC },
    sellPricePre: { type: DataTypes.NUMERIC },
    distPrice01: { type: DataTypes.NUMERIC },
    distPrice02: { type: DataTypes.NUMERIC },
    sectionWidth: { type: DataTypes.STRING },
    aspectRatio: { type: DataTypes.STRING },
    rimDiameter: { type: DataTypes.STRING },
    brandId: { type: DataTypes.INTEGER },
    brandName: { type: DataTypes.STRING },
    categoryId: { type: DataTypes.INTEGER },
    categoryParentId: { type: DataTypes.INTEGER },
    categoryName: { type: DataTypes.STRING },
    trackQty: { type: DataTypes.TINYINT },
    alertQty: { type: DataTypes.NUMERIC },
    active: { type: DataTypes.INTEGER },
    activeStatus: { type: DataTypes.STRING },
    exception01: { type: DataTypes.TINYINT },
    usageTimePeriod: { type: DataTypes.INTEGER },
    usageMileage: { type: DataTypes.INTEGER },
    productImage: { type: DataTypes.STRING },
    dummyCode: { type: DataTypes.STRING },
    dummyName: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_product' })
  return vwiProduct001
}
