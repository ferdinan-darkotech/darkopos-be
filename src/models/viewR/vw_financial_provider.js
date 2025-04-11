"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_financial_provider", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    code: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    providerType: { type: DataTypes.INTEGER },
    providerTypeCode: { type: DataTypes.STRING },
    providerTypeName: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_financial_provider' })
}
