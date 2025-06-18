"use strict";

module.exports = function (sequelize, DataTypes) {
  var Specification = sequelize.define("vw_specification", {
    categoryCode: { type: DataTypes.STRING },
    categoryName: { type: DataTypes.STRING },
    id: { type: DataTypes.INTEGER, primaryKey: true },
    categoryId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    deletedBy: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE },

    // [MASTER STOCKS GROUP - ADD]: FERDINAN - 16/06/2025
    groupId: { type: DataTypes.INTEGER },
    groupCode: { type: DataTypes.STRING },
    groupName: { type: DataTypes.STRING }
  }, { tableName: 'vw_specification' })
  return Specification
}
