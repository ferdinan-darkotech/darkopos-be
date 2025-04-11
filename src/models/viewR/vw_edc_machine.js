"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_edc_machine", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    code: { type: DataTypes.STRING },
    providerCode: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    surchargeOnUs: { type: DataTypes.INTEGER },
    surchargeOffUs: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_edc_machine' })
}
