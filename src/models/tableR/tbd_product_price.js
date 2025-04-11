"use strict";

module.exports = function(sequelize, DataTypes) {
  var productPrice = sequelize.define("tbd_product_price", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    costPrice: {
      type: DataTypes.DECIMAL(19,2),
    },
    sellPrice: {
      type: DataTypes.DECIMAL(19,2),
    },
    sellPricePre: {
      type: DataTypes.DECIMAL(19,2),
    },
    distPrice01: {
      type: DataTypes.DECIMAL(19,2),
    },
    distPrice02: {
      type: DataTypes.DECIMAL(19,2),
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    approval_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'tbd_product_price'
  }, {
    uniqueKeys: {
      uk_stock_price: {
        fields: ['storeId, productId']
      }
    }
  })

  return productPrice
}