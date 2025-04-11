"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwStockCategory = sequelize.define("vw_stock_category", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    categoryCode: {
      type: DataTypes.STRING(20)
    },
    categoryName: {
      type: DataTypes.STRING(50),
    },
    categoryImage: {
      type: DataTypes.STRING(50),
    },
    categoryParentId: {
      type: DataTypes.INTEGER,
    },
    categoryParentCode: {
      type: DataTypes.STRING(20)
    },
    categoryParentName: {
      type: DataTypes.STRING(50)
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    max_disc: {type: DataTypes.NUMERIC(16,5)},
    createdAt: { type: DataTypes.DATE },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: { type: DataTypes.DATE }
  }, {
      tableName: 'vw_stock_category'      
    }, {
      uniqueKeys: {
        category_unique_key: {
          fields: ['categoryCode']
        }
      }
    })
  
  return vwStockCategory
}