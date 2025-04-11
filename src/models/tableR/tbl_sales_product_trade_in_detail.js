"use strict";

module.exports = function (sequelize, DataTypes) {
  var ProductTradeIN = sequelize.define("tbl_sales_product_trade_in_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    trans_dtl_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    trans_id: {
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
    buy_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    so_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sales_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_src_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    store_src_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: {
      type: DataTypes.NUMERIC(16, 5),
      allowNull: true,
      defaultValue: 0.00
    },
    price: {
      type: DataTypes.NUMERIC(16, 5),
      allowNull: true,
      defaultValue: 0.00
    },
    disc_p: {
      type: DataTypes.NUMERIC(16, 5),
      allowNull: true,
      defaultValue: 0.00
    },
    disc_n: {
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
      tableName: 'tbl_sales_product_trade_in_detail',
      freezeTableName: true,
      timestamps: false
    })

  ProductTradeIN.removeAttribute('id')
  return ProductTradeIN
}