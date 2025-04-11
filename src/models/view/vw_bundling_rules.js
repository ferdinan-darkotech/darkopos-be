"use strict";

module.exports = function (sequelize, DataTypes) {
  var View = sequelize.define("vw_bundling_rules", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    type: { type: DataTypes.STRING },
    bundleId: { type: DataTypes.INTEGER },
    bundleName: { type: DataTypes.STRING },
    productId: { type: DataTypes.INTEGER },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    sellingPrice: { type: DataTypes.NUMERIC(19, 5) },
    qty: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_bundling_rules' })
  return View
}
