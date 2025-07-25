"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwMemberUnit004 = sequelize.define("vw_member_sales_by_unit_group", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
    },
    memberId: {
      type: DataTypes.INTEGER,
    },
    memberCode: {
      type: DataTypes.STRING,
    },
    memberName: {
      type: DataTypes.STRING,
    },
    policeNo: {
      type: DataTypes.STRING,
    },
    policeNoId: {
      type: DataTypes.STRING,
    },
    grandTotal: {
      type: DataTypes.DOUBLE,
    },
    totalDiscount: {
      type: DataTypes.DOUBLE,
    },
    nettoTotal: {
      type: DataTypes.DOUBLE,
    },
  }, {
      timestamps: false,
      freezeTableName: true
    }, {
      tableName: 'vw_member_sales_by_unit_group'
    })

  return vwMemberUnit004
}