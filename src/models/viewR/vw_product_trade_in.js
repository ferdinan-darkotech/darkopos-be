"use strict";

module.exports = function (sequelize, DataTypes) {
  var ProductTradeIN = sequelize.define("vw_product_trade_in", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    product_trd_id: { type: DataTypes.STRING },
    product_id: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    store_id: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    sell_price: { type: DataTypes.NUMERIC(16,5) },
    status: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING },
    updated_at: { type: DataTypes.DATE }
  }, { tableName: 'vw_product_trade_in', freezeTableName: true, timestamps: false })

  ProductTradeIN.removeAttribute('id')
  return ProductTradeIN
}
