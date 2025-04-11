"use strict";

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("vw_wo_category", {
    categoryCode: { type: DataTypes.STRING },
    categoryName: { type: DataTypes.STRING },
    categoryImage: { type: DataTypes.STRING },
    categoryParentId: { type: DataTypes.INTEGER },
    categoryParentCode: { type: DataTypes.STRING },
    categoryParentName: { type: DataTypes.STRING },
    categoryParentImage: { type: DataTypes.STRING },
    id: { type: DataTypes.INTEGER, primaryKey: true },
    productCategoryId: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    deletedBy: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_wo_category' })
  return Pos
}
