"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwMemberUnit003 = sequelize.define("vw_member_unit_003", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
    },
    lastMeter: {
      type: DataTypes.STRING,
    },
    model: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.STRING,
    },
    chassisNo: {
      type: DataTypes.STRING,
    },
    machineNo: {
      type: DataTypes.STRING,
    },
    // memberId: {
    //   type: DataTypes.INTEGER,
    // },
    // memberCode: {
    //   type: DataTypes.STRING,
    // },
    // memberName: {
    //   type: DataTypes.STRING,
    // },
    policeNo: {
      type: DataTypes.STRING,
    },
    policeNoId: {
      type: DataTypes.STRING,
    },
    transNo: {
      type: DataTypes.STRING,
    },
    transDate: {
      type: DataTypes.DATEONLY,
    },
    grandTotal: {
      type: DataTypes.DOUBLE,
    },
    totalDiscount: {
      type: DataTypes.DOUBLE,
    },
    DPP: {
      type: DataTypes.DOUBLE,
    },
    PPN: {
      type: DataTypes.DOUBLE,
    },
    nettoTotal: {
      type: DataTypes.DOUBLE,
    },
  }, {
      timestamps: false,
      freezeTableName: true
    }, {
      tableName: 'vw_member_unit_003'
    })

  return vwMemberUnit003
}