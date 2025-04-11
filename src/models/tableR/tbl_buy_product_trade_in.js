"use strict";

module.exports = function (sequelize, DataTypes) {
  var ProductTradeIN = sequelize.define("tbl_buy_product_trade_in", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    stock_buy_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sales_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ref_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_trade_in_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: true,
      defaultValue: 0.00
    },
    disc_p: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: true
    },
    disc_n: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: true
    },
    conditions: {
      type: DataTypes.NUMERIC(16,5),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '01'
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
      tableName: 'tbl_buy_product_trade_in',
      freezeTableName: true,
      timestamps: false
    })

  ProductTradeIN.removeAttribute('id')
  return ProductTradeIN
}