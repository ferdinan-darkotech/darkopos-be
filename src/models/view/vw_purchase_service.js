"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
    var Purchase = sequelize.define("vw_purchase_service", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    status: { type: DataTypes.STRING },
    storeId: { type: DataTypes.INTEGER },
    supplierId: { type: DataTypes.INTEGER },
    supplierCode: { type: DataTypes.INTEGER },
    supplierName: { type: DataTypes.STRING },
    reference: { type: DataTypes.STRING },
    memo: { type: DataTypes.STRING },
    transType: { type: DataTypes.STRING },
    void: { type: DataTypes.STRING },
    transNo: { type: DataTypes.STRING },
    transNoId: { type: DataTypes.INTEGER },
    taxType: { type: DataTypes.STRING },
    taxPercent: { type: DataTypes.INTEGER },
    transDate: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
      }
    },
    receiveDate: { type: DataTypes.DATE },
    invoiceDate: { type: DataTypes.DATE },
    dueDate: { type: DataTypes.DATE },
    productId: { type: DataTypes.INTEGER },
    productName: { type: DataTypes.STRING },
    qty: { type: DataTypes.NUMERIC },
    purchasePrice: { type: DataTypes.NUMERIC },
    total: { type: DataTypes.NUMERIC },
    discp1: { type: DataTypes.NUMERIC(16,2) },
    discp2: { type: DataTypes.NUMERIC(16,2) },
    discp3: { type: DataTypes.NUMERIC(16,2) },
    discp4: { type: DataTypes.NUMERIC(16,2) },
    discp5: { type: DataTypes.NUMERIC(16,2) },
    discNominal: { type: DataTypes.NUMERIC },
    discInvoicePercent: { type: DataTypes.NUMERIC },
    discInvoiceNominal: { type: DataTypes.NUMERIC },
    dpp: { type: DataTypes.NUMERIC },
    ppn: { type: DataTypes.NUMERIC },
    rounding: { type: DataTypes.NUMERIC },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    grandTotal: { type: DataTypes.NUMERIC },
    portion: { type: DataTypes.NUMERIC },
    discItem: { type: DataTypes.NUMERIC },
    discInvoice: { type: DataTypes.NUMERIC },
    rounding_netto: { type: DataTypes.DECIMAL(19, 2) },
    rounding_ppn: { type: DataTypes.DECIMAL(19, 2) },
    rounding_dpp: { type: DataTypes.DECIMAL(19, 2) },
    totalDiscount: { type: DataTypes.NUMERIC },
    roundingItem: { type: DataTypes.NUMERIC },
    netto: { type: DataTypes.NUMERIC },

    // [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
    purchaseType: { type: DataTypes.STRING },
    }, {
        tableName: 'vw_purchase_service'
    })

    return Purchase
}