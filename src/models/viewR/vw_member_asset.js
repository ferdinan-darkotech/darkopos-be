"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_member_asset", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    memberId: { type: DataTypes.INTEGER },
    memberCode: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    address01: { type: DataTypes.STRING },
    address02: { type: DataTypes.STRING },
    mobileNumber: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    cashback: { type: DataTypes.INTEGER },
    showAsDiscount: { type: DataTypes.TINYINT },
    memberSellPrice: { type: DataTypes.STRING },
    memberTypeCode: { type: DataTypes.STRING },
    memberTypeName: { type: DataTypes.STRING },
    policeNo: { type: DataTypes.STRING },
    merk: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN },
    brandid: { type: DataTypes.INTEGER },
    modelid: { type: DataTypes.INTEGER },
    typeid: { type: DataTypes.INTEGER },
    year: { type: DataTypes.INTEGER },
    chassisNo: { type: DataTypes.STRING },
    machineNo: { type: DataTypes.STRING },
    expired: { type: DataTypes.DATE },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    deletedBy: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_member_asset' })
}
