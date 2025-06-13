"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("vw_pos", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    transNo: { type: DataTypes.STRING },
    storeId: { type: DataTypes.INTEGER },
    woId: { type: DataTypes.INTEGER },
    woReference: { type: DataTypes.STRING },
    technicianId: { type: DataTypes.STRING },
    technicianName: { type: DataTypes.STRING },
    memberId: { type: DataTypes.INTEGER },
    memberCode: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    address01: { type: DataTypes.STRING },
    address02: { type: DataTypes.STRING },
    memberTypeName: { type: DataTypes.STRING },
    memberTypeId: { type: DataTypes.INTEGER },
    memberSellPrice: { type: DataTypes.STRING },
    memberPendingPayment: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    mobileNumber: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    transDate: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
      }
    },
    transTime: { type: DataTypes.DATE },
    cashierTransId: { type: DataTypes.INTEGER },
    cashierName: { type: DataTypes.STRING },
    total: { type: DataTypes.INTEGER },
    discInvoicePercent: { type: DataTypes.NUMERIC },
    discInvoiceNominal: { type: DataTypes.NUMERIC },
    creditCardNo: { type: DataTypes.STRING },
    creditCardType: { type: DataTypes.STRING },
    creditCardCharge: { type: DataTypes.INTEGER },
    totalCreditCard: { type: DataTypes.INTEGER },
    discount: { type: DataTypes.INTEGER },
    rounding: { type: DataTypes.INTEGER },
    paid: { type: DataTypes.INTEGER },
    change: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.STRING },
    createdByName: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    policeNo: { type: DataTypes.STRING },
    policeNoId: { type: DataTypes.INTEGER },
    merk: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    year: { type: DataTypes.INTEGER },
    chassisNo: { type: DataTypes.STRING },
    machineNo: { type: DataTypes.STRING },
    expired: { type: DataTypes.DATE },
    discountLoyalty: { type: DataTypes.INTEGER },
    lastCashback: { type: DataTypes.INTEGER },
    gettingCashback: { type: DataTypes.INTEGER },
    lastMeter: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(1) },
    memo: { type: DataTypes.STRING },
    taxType: { type: DataTypes.STRING },
    paymentVia: { type: DataTypes.STRING },
    current_duplicate: { type: DataTypes.INTEGER },
    total_duplicate: { type: DataTypes.INTEGER },
    no_tax_series: { type: DataTypes.STRING },

    // [NPWP]: FERDINAN - 2025-05-07
    npwp_address: { type: DataTypes.STRING },

    // [TGL JATUH TEMPO]: FERDINAN - 2025-05-09
    topdate: { type: DataTypes.DATE },

    // [16 DIGIT TAX ID]: FERDINAN - 2025-06-11
    newtaxid: { type: DataTypes.STRING },
    taxdigit: { type: DataTypes.INTEGER }
  }, {tableName: 'vw_pos'})
  return Pos
}
