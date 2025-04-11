"use strict";

module.exports = function (sequelize, DataTypes) {
  var StockProductSecond = sequelize.define("vw_stock_product_second", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    store_id: { type: DataTypes.INTEGER },
    store_code: { type: DataTypes.STRING },
    store_name: { type: DataTypes.STRING },
    product_id: { type: DataTypes.INTEGER },
    product_code: { type: DataTypes.STRING },
    product_name: { type: DataTypes.STRING },
    qty_in: { type: DataTypes.INTEGER },
    qty_out: { type: DataTypes.INTEGER },
    qty_onhand: { type: DataTypes.INTEGER },
    avg_price: { type: DataTypes.NUMERIC(16,5) },
    created_by: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING },
    updated_at: { type: DataTypes.DATE }
  }, { tableName: 'vw_stock_product_second', freezeTableName: true, timestamps: false })

  StockProductSecond.removeAttribute('id')
  return StockProductSecond
}
