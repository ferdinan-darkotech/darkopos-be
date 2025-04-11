"use strict";

module.exports = function(sequelize, DataTypes) {
  var StockCategory = sequelize.define("tbl_stock_category", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    categoryCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: 'category_unique_key',
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
      }
    },
    categoryName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    categoryImage: {
      type: DataTypes.STRING(50),
    },
    categoryParentId: {
      type: DataTypes.INTEGER,
    },
    max_disc: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: true,
      defaultValue: 0
    },
    max_disc_nominal: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: true,
      defaultValue: null
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: 'tbl_stock_category'
  }, {
    uniqueKeys: {
      category_unique_key: {
        fields: ['categoryCode']
      }
    }
  })

  return StockCategory
}