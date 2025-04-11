"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwProductTradeIN = sequelize.define("vw_stock_product_trade_in", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    stock_id: { type: DataTypes.STRING },
    sales_no: { type: DataTypes.STRING },
    store_id: { type: DataTypes.INTEGER },
    store_code: { type: DataTypes.STRING },
    store_name: { type: DataTypes.STRING },
    product_id: { type: DataTypes.INTEGER },
    product_code: { type: DataTypes.STRING },
    product_name: { type: DataTypes.STRING },
    ref_id: { type: DataTypes.STRING },
    qty: { type: DataTypes.INTEGER },
    sell_price: { type: DataTypes.NUMERIC },
    price: { type: DataTypes.NUMERIC },
    disc_n: { type: DataTypes.NUMERIC },
    disc_p: { type: DataTypes.NUMERIC },
    conditions: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING },
    updated_at: { type: DataTypes.DATE }
  }, { tableName: 'vw_stock_product_trade_in', freezeTableName: true, timestamps: false })

  vwProductTradeIN.removeAttribute('id')
  return vwProductTradeIN
}
