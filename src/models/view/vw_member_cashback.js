"use strict";

module.exports = function (sequelize, DataTypes) {
  var Member = sequelize.define("vw_member_cashback", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    type: { type: DataTypes.STRING },
    loyaltyId: { type: DataTypes.INTEGER },
    active: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATE },
    endDate: { type: DataTypes.DATE },
    expirationDate: { type: DataTypes.DATE },
    setValue: { type: DataTypes.NUMERIC },
    newMember: { type: DataTypes.INTEGER },
    memberId: { type: DataTypes.INTEGER },
    memberCode: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    posId: { type: DataTypes.INTEGER },
    transNo: { type: DataTypes.STRING },
    transDate: { type: DataTypes.DATE },
    posDate: { type: DataTypes.DATE },
    minPayment: { type: DataTypes.INTEGER },
    maxDiscount: { type: DataTypes.INTEGER },
    loyaltySetValue: { type: DataTypes.INTEGER },
    lastCashback: { type: DataTypes.INTEGER },
    discountLoyalty: { type: DataTypes.INTEGER },
    cashbackIn: { type: DataTypes.INTEGER },
    cashbackOut: { type: DataTypes.INTEGER },
    memo: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    deletedBy: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_member_cashback' })
  return Member
}
