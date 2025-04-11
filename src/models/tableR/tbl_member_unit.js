"use strict";

module.exports = function (sequelize, DataTypes) {
  var MemberUnit = sequelize.define("tbl_member_unit", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modelid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    brandid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER(4),
      allowNull: false
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      tableName: 'tbl_member_unit',
      paranoid: true
    })

  return MemberUnit
}