"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwMemberUnit = sequelize.define("vw_member_unit", {
    id: {
      type: DataTypes.INTEGER
    },
    memberCode: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_]{6,16}$/i
      }
    },
    policeNo: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,50}$/i
      }
    },
    merk: {
      type: DataTypes.STRING(15),
    },
    model: {
      type: DataTypes.STRING(15),
    },
    type: {
      type: DataTypes.STRING(15),
    },
    brandid: { type: DataTypes.INTEGER },
    modelid: { type: DataTypes.INTEGER },
    typeid: { type: DataTypes.INTEGER },
    active: { type: DataTypes.BOOLEAN },
    year: {
      type: DataTypes.INTEGER,
    },
    chassisNo: {
      type: DataTypes.STRING(20),
    },
    machineNo: {
      type: DataTypes.STRING(20),
    },
    expired: {
      type: DataTypes.DATEONLY,
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'vw_member_unit',
      paranoid: true
    })

  return vwMemberUnit
}