"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vwi_sale_payment", {
    storeCode: { type: DataTypes.STRING },
    storeId: { type: DataTypes.INTEGER },
    transNo: { type: DataTypes.STRING },
    transDate: { type: DataTypes.DATE },
    paymentOptionCode: { type: DataTypes.STRING },
    paymentTypeName: { type: DataTypes.STRING },
    providerName: { type: DataTypes.STRING },
    cardNo: { type: DataTypes.STRING },
    cardInfo: { type: DataTypes.STRING },
    edcName: { type: DataTypes.STRING },
    netto: { type: DataTypes.NUMERIC }
  }, { tableName: 'vwi_sale_payment' })
}
