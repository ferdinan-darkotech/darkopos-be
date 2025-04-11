"use strict";

module.exports = function (sequelize, DataTypes) {
  var View = sequelize.define("vw_bundling_reward", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    type: { type: DataTypes.STRING },
    bundleId: { type: DataTypes.INTEGER },
    bundleName: { type: DataTypes.STRING },
    productId: { type: DataTypes.INTEGER },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    sellingPrice: { type: DataTypes.NUMERIC },
    active: { type: DataTypes.STRING },
    qty: { type: DataTypes.INTEGER },
    disc1: { type: DataTypes.NUMERIC },
    disc2: { type: DataTypes.NUMERIC },
    disc3: { type: DataTypes.NUMERIC },
    discount: { type: DataTypes.NUMERIC },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_bundling_reward' })
  return View
}
