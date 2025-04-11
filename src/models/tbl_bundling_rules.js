"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_bundling_rules", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    bundleId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    sellingPrice: {
      type: DataTypes.NUMERIC(19,2),
      allowNull: true,
      defaultValue: 0.00
    },
    serviceId: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    qty: {
      type: DataTypes.STRING(25),
      allowNull: false,
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
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_bundling_rules'
    })

  return Table
}