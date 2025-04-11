"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwMemberUnit002 = sequelize.define("vw_member_sales_by_unit_history", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
    },
    serviceType: {
      type: DataTypes.STRING,
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
    storeId: {
      type: DataTypes.STRING,
    },
    transNo: {
      type: DataTypes.STRING,
    },
    transDate: {
      type: DataTypes.DATEONLY,
    },
    productId: {
      type: DataTypes.STRING,
    },
    productCode: {
      type: DataTypes.STRING,
    },
    productName: {
      type: DataTypes.STRING,
    },
    qty: {
      type: DataTypes.DOUBLE,
    },
    sellingPrice: {
      type: DataTypes.DOUBLE,
    },
    total: {
      type: DataTypes.DOUBLE,
    },
    disc1: {
      type: DataTypes.DOUBLE,
    },
    disc2: {
      type: DataTypes.DOUBLE,
    },
    disc3: {
      type: DataTypes.DOUBLE,
    },
    discount: {
      type: DataTypes.DOUBLE,
    },
    discItem: {
      type: DataTypes.DOUBLE,
    },
    discInvoicePercent: {
      type: DataTypes.DOUBLE,
    },
    discInvoiceNominal: {
      type: DataTypes.DOUBLE,
    },
    discInvoice: {
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
      tableName: 'vw_member_sales_by_unit_history'
    })

  return vwMemberUnit002
}