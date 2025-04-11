/**
 * Created by Veirry on 05/02/2018.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Payment = sequelize.define("vw_payment_ap_006", {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        storeId: { type: DataTypes.INTEGER },
        supplierId: { type: DataTypes.INTEGER },
        supplierName: { type: DataTypes.STRING },
        supplierTaxId: { type: DataTypes.STRING },
        address01: { type: DataTypes.STRING },
        address02: { type: DataTypes.STRING },
        bankAccountId: { type: DataTypes.INTEGER },
        accountNo: { type: DataTypes.STRING },
        accountName: { type: DataTypes.STRING },
        chargeFee: { type: DataTypes.NUMERIC },
        chargeFeePercent: { type: DataTypes.NUMERIC },
        bankId: { type: DataTypes.INTEGER },
        bankCode: { type: DataTypes.STRING },
        bankName: { type: DataTypes.STRING },
        transNo: { type: DataTypes.STRING },
        checkNo: { type: DataTypes.STRING },
        invoiceDate: { type: DataTypes.DATE },
        tempo: { type: DataTypes.INTEGER },
        dueDate: { type: DataTypes.DATE },
        transDate: { type: DataTypes.DATE },
        period: { type: DataTypes.STRING },
        year: { type: DataTypes.STRING },
        sisa: { type: DataTypes.NUMERIC },
        change: { type: DataTypes.NUMERIC },
        invPeriod: { type: DataTypes.STRING },
        invYear: { type: DataTypes.STRING },
        transTime: { type: DataTypes.DATE },
        typeCode: { type: DataTypes.STRING },
        beginValue: { type: DataTypes.INTEGER },
        paidBank: { type: DataTypes.NUMERIC },
        paid: { type: DataTypes.NUMERIC },
        nettoTotal: { type: DataTypes.NUMERIC },
        statusPaid: { type: DataTypes.STRING },
        statusActive: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        cardName: { type: DataTypes.STRING },
        cardNo: { type: DataTypes.STRING },
        active: { type: DataTypes.INTEGER },
        createdBy: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedBy: { type: DataTypes.STRING },
        updatedAt: { type: DataTypes.DATE }        
    }, { tableName: 'vw_payment_ap_006' })
    return Payment
}