"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vwi_payment_option", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    parentId: { type: DataTypes.INTEGER },
    parentCode: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING },
    paymentTypeId: { type: DataTypes.INTEGER },
    paymentTypeCode: { type: DataTypes.STRING },
    paymentTypeName: { type: DataTypes.STRING },
    providerTypeCode: { type: DataTypes.STRING },
    providerTypeName: { type: DataTypes.STRING },
    providerId: { type: DataTypes.INTEGER },
    providerCode: { type: DataTypes.STRING },
    providerName: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vwi_payment_option' })
}
