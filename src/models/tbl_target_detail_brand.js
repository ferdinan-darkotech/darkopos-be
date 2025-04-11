"use strict";

module.exports = function (sequelize, DataTypes) {
  var Target = sequelize.define("tbl_target_detail_brand", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    targetSales: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    targetSalesQty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    },
    deletedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
  }, {
      tableName: 'tbl_target_detail_brand',
      paranoid: true,
      timestamp: true
    })
  return Target
}