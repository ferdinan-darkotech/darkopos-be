"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var Data = sequelize.define("vw_wo_001", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeId: { type: DataTypes.INTEGER },
    woNo: { type: DataTypes.STRING },
    woReference: { type: DataTypes.STRING },
    transNo: { type: DataTypes.STRING },
    woDate: { type: DataTypes.DATE },
    transDate: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
      }
    },
    cashierName: { type: DataTypes.STRING },
    technicianName: { type: DataTypes.STRING },
    memberId: { type: DataTypes.INTEGER },
    memberCode: { type: DataTypes.STRING },
    address01: { type: DataTypes.STRING },
    memberTypeId: { type: DataTypes.INTEGER },
    memberTypeName: { type: DataTypes.STRING },
    memberSellPrice: { type: DataTypes.STRING },
    showAsDiscount: { type: DataTypes.TINYINT },
    memberPendingPayment: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    mobileNumber: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    cashback: { type: DataTypes.INTEGER },
    policeNoId: { type: DataTypes.INTEGER },
    policeNo: { type: DataTypes.STRING },
    merk: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    year: { type: DataTypes.INTEGER },
    expired: { type: DataTypes.DATE },
    chassisNo: { type: DataTypes.STRING },
    machineNo: { type: DataTypes.STRING },
    takeAway: { type: DataTypes.STRING },
    timeIn: { type: DataTypes.DATE },
    timeOut: { type: DataTypes.STRING },
    transTime: { type: DataTypes.DATE },
    status: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    deletedBy: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_wo_001' })
  return Data
}
