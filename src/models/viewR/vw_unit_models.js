"use strict";

module.exports = function (sequelize, DataTypes) {
  const vw_unit_models = sequelize.define("vw_unit_models", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    brandId: { type: DataTypes.INTEGER },
    brandCode: { type: DataTypes.STRING(30) },
    brandName: { type: DataTypes.STRING(20) },
    modelCode: { type: DataTypes.STRING(30) },
    modelName: { type: DataTypes.STRING(20) },
    categoryId: { type: DataTypes.INTEGER },
    categoryCode: { type: DataTypes.STRING(30) },
    categoryName: { type: DataTypes.STRING(20) },
    active: { type: DataTypes.BOOLEAN },
    createdBy: { type: DataTypes.STRING(30) },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING(30) },
    updatedAt: { type: DataTypes.DATE },
  }, {
      tableName: 'vw_unit_models'
    })

  return vw_unit_models
}
