"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwProductTradeIN = sequelize.define("vw_sales_product_trade_in_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    trans_dtl_id: { type: DataTypes.STRING },
    trans_id: { type: DataTypes.STRING },
    trans_no: { type: DataTypes.STRING },
    so_no: { type: DataTypes.STRING },
    sales_no: { type: DataTypes.STRING },
    trans_date: { type: DataTypes.DATE },
    buy_date: { type: DataTypes.DATE },
    store_id: { type: DataTypes.INTEGER },
    store_code: { type: DataTypes.STRING },
    store_name: { type: DataTypes.STRING },
    store_src_id: { type: DataTypes.INTEGER },
    store_src_code: { type: DataTypes.STRING },
    store_src_name: { type: DataTypes.STRING },
    product_id: { type: DataTypes.INTEGER },
    product_code: { type: DataTypes.STRING },
    product_name: { type: DataTypes.STRING },
    qty: { type: DataTypes.INTEGER },
    conditions: { type: DataTypes.NUMERIC(16, 5) },
    weight: { type: DataTypes.NUMERIC(16, 5) },
    price: { type: DataTypes.NUMERIC(16, 5) },
    disc_p: { type: DataTypes.NUMERIC(16, 5) },
    disc_n: { type: DataTypes.NUMERIC(16, 5) },
    status: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING },
    updated_at: { type: DataTypes.DATE }
  }, { tableName: 'vw_sales_product_trade_in_detail', freezeTableName: true, timestamps: false })

  vwProductTradeIN.removeAttribute('id')
  return vwProductTradeIN
}
