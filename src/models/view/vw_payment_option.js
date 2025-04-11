"use strict";

module.exports = function (sequelize, DataTypes) {
  var PaymentOption = sequelize.define("vw_payment_option", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    parentId: { type: DataTypes.INTEGER },
    paymentParentId: { type: DataTypes.INTEGER },
    paymentParentCode: { type: DataTypes.STRING },
    paymentParentName: { type: DataTypes.STRING },
    sort: { type: DataTypes.INTEGER },
    typeCode: { type: DataTypes.STRING },
    typeName: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    cashbackNominal: { type: DataTypes.NUMERIC },
    cashbackPercent: { type: DataTypes.NUMERIC },
    discNominal: { type: DataTypes.NUMERIC },
    discPercent: { type: DataTypes.NUMERIC },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_payment_option' })
  return PaymentOption
}
