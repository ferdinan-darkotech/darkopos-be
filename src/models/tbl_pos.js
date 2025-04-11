"use strict";

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("tbl_pos", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transNo: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    woReference: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    woId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    technicianId: {
      type: DataTypes.STRING(10),
    },
    memberCode: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    cashierTransId: {
      type: DataTypes.INTEGER(10)
    },
    transDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    transTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    taxType: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    taxval: {
      type: DataTypes.NUMERIC(16,2),
      allowNull: true,
    },
    discountLoyalty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    lastCashback: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    gettingCashback: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creditCardNo: {
      type: DataTypes.STRING(50),
    },
    creditCardType: {
      type: DataTypes.STRING(10),
    },
    creditCardCharge: {
      type: DataTypes.INTEGER,
    },
    totalCreditCard: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rounding: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    change: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lastMeter: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // policeNo: {
    //   type: DataTypes.STRING(15),
    //   allowNull: true
    // },
    policeNoId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    queue_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    memo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    paymentVia: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    total_dpp: {
      type: DataTypes.NUMERIC(16, 5),
      allowNull: true,
      defaultValue: 0
    },
    total_ppn: {
      type: DataTypes.NUMERIC(16, 5),
      allowNull: true,
      defaultValue: 0
    },
    total_netto: {
      type: DataTypes.NUMERIC(16, 5),
      allowNull: true,
      defaultValue: 0
    },
    total_products: {
      type: DataTypes.NUMERIC(16, 5),
      allowNull: true,
      defaultValue: 0
    },
    total_services: {
      type: DataTypes.NUMERIC(16, 5),
      allowNull: true,
      defaultValue: 0
    },
    no_tax_series: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    stat_tax_series: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '00'
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
  }, {
      tableName: 'tbl_pos'
    })

  return Pos
}
