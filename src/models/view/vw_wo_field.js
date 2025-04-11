"use strict";

module.exports = function (sequelize, DataTypes) {
  var Data = sequelize.define("vw_wo_field", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    fieldName: { type: DataTypes.STRING },
    sortingIndex: { type: DataTypes.INTEGER },
    sorting: { type: DataTypes.INTEGER },
    fieldParentId: { type: DataTypes.INTEGER },
    fieldParentName: { type: DataTypes.STRING },
    typefields: { type: DataTypes.INTEGER },
    typevalue: { type: DataTypes.NUMERIC },
    relationid: { type: DataTypes.JSON },
    usageperiod: { type: DataTypes.INTEGER },
    usagemileage: { type: DataTypes.DECIMAL(19,2) },
    jsongroups: { type: DataTypes.JSON },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    deletedBy: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE },
  }, { tableName: 'vw_wo_field' })
  return Data
}
