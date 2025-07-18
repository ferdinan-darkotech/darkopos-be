"use strict";

module.exports = function (sequelize, DataTypes) {
  var ProductTradeIN = sequelize.define("tbl_product_trade_in", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    product_trd_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sell_price: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: true,
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      tableName: 'tbl_product_trade_in',
      freezeTableName: true,
      timestamps: false
    })

  ProductTradeIN.removeAttribute('id')
  return ProductTradeIN
}