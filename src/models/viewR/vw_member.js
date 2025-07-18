"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_member", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    memberCode: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    memberTypeCode: { type: DataTypes.STRING },
    memberTypeName: { type: DataTypes.STRING },
    showAsDiscount: { type: DataTypes.TINYINT },
    memberSellPrice: { type: DataTypes.STRING },
    memberGroupCode: { type: DataTypes.STRING },
    memberGroupName: { type: DataTypes.STRING },
    membercategoryname: { type: DataTypes.STRING },
    membercategorycode: { type: DataTypes.STRING },
    idType: { type: DataTypes.STRING },
    idNo: { type: DataTypes.STRING },
    address01: { type: DataTypes.STRING },
    address02: { type: DataTypes.STRING },
    cityCode: { type: DataTypes.STRING },
    cityName: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    birthDate: { type: DataTypes.DATE },
    zipcode: { type: DataTypes.STRING },
    mobileNumber: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    birthday: { type: DataTypes.DATE },
    gender: { type: DataTypes.STRING },
    taxId: { type: DataTypes.STRING },
    cashback: { type: DataTypes.INTEGER },
    validityDate: { type: DataTypes.STRING },
    mobileActivate: { type: DataTypes.STRING },
    verifications: { type: DataTypes.JSON },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    prov_nama: { type: DataTypes.STRING },
    kab_nama: { type: DataTypes.STRING },
    kec_nama: { type: DataTypes.STRING },
    kel_nama: { type: DataTypes.STRING },
    kel_id: { type: DataTypes.INTEGER },
    zipcode: { type: DataTypes.STRING },
    npwp_address: { type: DataTypes.STRING },
    dept_id: { type: DataTypes.INTEGER },
    dept_code: { type: DataTypes.STRING },
    dept_name: { type: DataTypes.STRING },
    branch_id: { type: DataTypes.INTEGER },
    branch_name: { type: DataTypes.STRING },
    verification_status: { type: DataTypes.STRING },
    verif_request_at: { type: DataTypes.DATE },
    verif_approved_at: { type: DataTypes.DATE },
    
    // [ITCF MEMBER]: FERDINAN - 2025-04-21
    referralcode: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // [16 DIGIT TAX ID]: FERDINAN - 2025-06-11
    newtaxid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    taxdigit: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, { tableName: 'vw_member' })
}
