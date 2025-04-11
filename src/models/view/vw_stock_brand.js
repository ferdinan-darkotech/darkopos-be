"use strict";

module.exports = function(sequelize, DataTypes) {
  var StockBrand = sequelize.define("vw_stock_brand", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    brandCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: 'brand_unique_key',
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
      }
    },
    brandName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
      }
    },
    brandImage: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[a-z0-9_. ]{3,50}$/i
      }
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
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
    tableName: 'vw_stock_brand'
  }, {
    uniqueKeys: {
      brand_unique_key: {
        fields: ['brandCode']
      }
    }
  })

  return StockBrand
}