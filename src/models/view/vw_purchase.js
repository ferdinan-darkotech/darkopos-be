"use strict";

module.exports = function (sequelize, DataTypes) {
  var Purchase = sequelize.define("vw_purchase", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeId: { type: DataTypes.STRING },
    transNo: { type: DataTypes.STRING },
    transDate: { type: DataTypes.STRING },
    receiveDate: { type: DataTypes.STRING },
    invoiceDate: { type: DataTypes.STRING },
    supplierId: { type: DataTypes.INTEGER },
    supplierCode: { type: DataTypes.INTEGER },
    supplierName: { type: DataTypes.STRING },
    supplierTaxId: { type: DataTypes.STRING },
    address01: { type: DataTypes.STRING },
    address02: { type: DataTypes.STRING },
    taxType: { type: DataTypes.STRING },
    taxPercent: { type: DataTypes.INTEGER },
    reference: { type: DataTypes.STRING },
    memo: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    transType: { type: DataTypes.STRING },
    discInvoicePercent: { type: DataTypes.NUMERIC },
    discInvoiceNominal: { type: DataTypes.NUMERIC },
    rounding: { type: DataTypes.NUMERIC },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    total: { type: DataTypes.NUMERIC },
    totalDiscount: { type: DataTypes.NUMERIC },
    totalRounding: { type: DataTypes.NUMERIC },
    totalDPP: { type: DataTypes.NUMERIC },
    totalPPN: { type: DataTypes.NUMERIC },
    nettoTotal: { type: DataTypes.NUMERIC },
    printNo: { type: DataTypes.INTEGER },
    tempo: { type: DataTypes.INTEGER },
    dueDate: { type: DataTypes.DATE },
    invoiceType: { type: DataTypes.STRING },
    taxId: { type: DataTypes.STRING }
  }, { tableName: 'vw_purchase' })
  return Purchase
}
