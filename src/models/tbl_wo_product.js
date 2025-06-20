// [NEW]: FERDINAN - 2025-03-02
"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_wo_product", {
    woid: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    productcode: {
      type: DataTypes.STRING(60),
      primaryKey: true
    },
    employeecode: {
      type: DataTypes.STRING(30),
    },
    bundleid: {
      type: DataTypes.INTEGER,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sellprice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sellingprice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    disc1: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    disc2: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    disc3: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discountloyalty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalprice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totaldiscount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totaldpp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalppn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalnetto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    typecode: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    bundleid: {
      type: DataTypes.INTEGER,
    },
    createdby: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
            is: /^[a-z0-9\_\-]{3,30}$/i
        }
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedby: {
        type: DataTypes.STRING(15),
        allowNull: true,
        validate: {
            is: /^[a-z0-9\_\-]{3,30}$/i
        }
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    keterangan: {
      type: DataTypes.STRING(250)
    },

    // [NEW]: FERDINAN - 2025-03-25
    salestype: { type: DataTypes.STRING(30) },
    additionalpricenominal: { type: DataTypes.INTEGER },
    additionalpricepercent: { type: DataTypes.INTEGER },
    additionalpriceroundingdigit: { type: DataTypes.INTEGER },

    // [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
    transnopurchase: { type: DataTypes.STRING, allowNull: true },

    // [HPP VALIDATION]: FERDINAN - 2025-05-22
    hppperiod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hppprice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    // [NO BAN]: FERDINAN - 2025-06-20
    noreference: { type: DataTypes.STRING, allowNull: true }
  }, {
      tableName: 'tbl_wo_product'
    })

  return Table
}