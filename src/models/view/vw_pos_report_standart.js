"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("vw_pos_report_standart", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    transNo: { type: DataTypes.STRING },
    storeId: { type: DataTypes.INTEGER },
    woId: { type: DataTypes.INTEGER },
    woReference: { type: DataTypes.STRING },
    technicianId: { type: DataTypes.INTEGER },
    technicianName: { type: DataTypes.STRING },
    memberId: { type: DataTypes.INTEGER },
    memberCode: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    address01: { type: DataTypes.STRING },
    address02: { type: DataTypes.STRING },
    memberTypeId: { type: DataTypes.INTEGER },
    memberTypeName: { type: DataTypes.STRING },
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
    discount: { type: DataTypes.NUMERIC },
    rounding: { type: DataTypes.INTEGER },
    paid: { type: DataTypes.INTEGER },
    change: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.STRING },
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
    lastMeter: { type: DataTypes.INTEGER },
    memo: { type: DataTypes.STRING },
    taxType: { type: DataTypes.STRING },
    paymentVia: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    netto: { type: DataTypes.NUMERIC }
  }, { tableName: 'vw_pos_report_standart' })
  return Pos
}
