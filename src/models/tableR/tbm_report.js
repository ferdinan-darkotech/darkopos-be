"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbm_report", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false },
    reportName: { type: DataTypes.STRING, allowNull: false },
    parentId: { type: DataTypes.STRING, allowNull: true },
    route: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.DATE, allowNull: false },
    createdAt: { type: DataTypes.STRING, allowNull: false },
    updatedBy: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.STRING, allowNull: true },
  }, { tableName: 'tbm_report' })
}
