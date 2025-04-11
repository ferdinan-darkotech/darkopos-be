"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_bundling_reward", {
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
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    sellingPrice: {
      type: DataTypes.NUMERIC(19,2),
      allowNull: true,
      defaultValue: 0.00
    },
    qty: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    disc1: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    disc2: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    disc3: {
      type: DataTypes.DECIMAL(19, 2),
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
      tableName: 'tbl_bundling_reward'
    })

  return Table
}