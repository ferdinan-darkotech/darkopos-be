"use strict";

module.exports = function (sequelize, DataTypes) {
  var MemberUnit = sequelize.define("tba_member_unit", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    memberUnitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    policeNo: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,15}$/i
      }
    },
    merk: {
      type: DataTypes.STRING(30),
    },
    model: {
      type: DataTypes.STRING(30),
    },
    type: {
      type: DataTypes.STRING(30),
    },
    year: {
      type: DataTypes.INTEGER(4),
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
    memo: {
      type: DataTypes.STRING(100),
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
      tableName: 'tba_member_unit',
      paranoid: true
    })

  return MemberUnit
}