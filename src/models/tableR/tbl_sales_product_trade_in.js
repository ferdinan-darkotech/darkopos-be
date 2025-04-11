"use strict";

module.exports = function (sequelize, DataTypes) {
  var ProductTradeIN = sequelize.define("tbl_sales_product_trade_in", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    trans_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendor_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trans_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    trans_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pic_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_price: {
      type: DataTypes.NUMERIC(16, 5),
      allowNull: true,
      defaultValue: 0.00
    },
    total_discount: {
      type: DataTypes.NUMERIC(16, 5),
      allowNull: true,
      defaultValue: 0.00
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
      tableName: 'tbl_sales_product_trade_in',
      freezeTableName: true,
      timestamps: false
    })

  ProductTradeIN.removeAttribute('id')
  return ProductTradeIN
}