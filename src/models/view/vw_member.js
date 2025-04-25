"use strict";

module.exports = function (sequelize, DataTypes) {
  var Member = sequelize.define("vw_member", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    memberCode: {
      type: DataTypes.STRING(16),
      unique: true,
    },
    memberName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    memberGroupId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    memberGroupName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    memberTypeId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    memberTypeName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    idType: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    idNo: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    address01: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    address02: {
      type: DataTypes.STRING(50)
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(30),
    },
    zipCode: {
      type: DataTypes.STRING(10),
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.STRING(1)
    },
    taxId: {
      type: DataTypes.STRING(10)
    },
    cashback: {
      type: DataTypes.INTEGER
    },
    validityDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    verification_status: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    verif_request_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verif_approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },

    // [ITCF MEMBER]: FERDINAN - 2025-04-21
    referralcode: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
      tableName: 'vw_member'
    })

  return Member
}