"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwProductTradeIN = sequelize.define("vw_sales_product_trade_in", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    trans_id: { type: DataTypes.INTEGER },
    trans_no: { type: DataTypes.STRING },
    trans_date: { type: DataTypes.DATE },
    store_id: { type: DataTypes.INTEGER },
    store_code: { type: DataTypes.STRING },
    store_name: { type: DataTypes.STRING },
    pic_id: { type: DataTypes.INTEGER },
    pic_code: { type: DataTypes.STRING },
    pic_name: { type: DataTypes.STRING },
    pic_phone_number: { type: DataTypes.STRING },
    vendor_id: { type: DataTypes.STRING },
    vendor_code: { type: DataTypes.STRING },
    vendor_name: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    phone_number: { type: DataTypes.STRING },
    total_qty: { type: DataTypes.INTEGER },
    total_price: { type: DataTypes.NUMERIC(16, 5) },
    total_discount: { type: DataTypes.NUMERIC(16, 5) },
    grand_total: { type: DataTypes.NUMERIC(16, 5) },
    status: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING },
    updated_at: { type: DataTypes.DATE }
  }, { tableName: 'vw_sales_product_trade_in', freezeTableName: true, timestamps: false })

  vwProductTradeIN.removeAttribute('id')
  return vwProductTradeIN
}
