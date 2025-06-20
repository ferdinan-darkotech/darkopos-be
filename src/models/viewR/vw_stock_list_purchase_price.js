// [HARGA PRODUCT BY PURCHASE PRICE]: FERDINAN - 2025-06-18
"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_stock_list_purchase_price", {
    storeid: { type: DataTypes.INTEGER, primaryKey: true },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    brandid: { type: DataTypes.INTEGER },
    brandname: { type: DataTypes.STRING },
    categoryid: { type: DataTypes.INTEGER },
    categorycode: { type: DataTypes.STRING },
    categoryname: { type: DataTypes.STRING },
    shelf: { type: DataTypes.STRING },
    qtystock: { type: DataTypes.NUMERIC },
    qtypartition: { type: DataTypes.NUMERIC },
    qtyonhand: { type: DataTypes.NUMERIC },
    costprice: { type: DataTypes.NUMERIC },
    costpricelocal: { type: DataTypes.NUMERIC },
    costpriceglobal: { type: DataTypes.NUMERIC },
    sellprice: { type: DataTypes.NUMERIC },
    sellpricelocal: { type: DataTypes.NUMERIC },
    sellpriceglobal: { type: DataTypes.NUMERIC },
    distprice01: { type: DataTypes.NUMERIC },
    distprice01local: { type: DataTypes.NUMERIC },
    distprice01global: { type: DataTypes.NUMERIC },
    distprice02: { type: DataTypes.NUMERIC },
    distprice02local: { type: DataTypes.NUMERIC },
    distprice02global: { type: DataTypes.NUMERIC },
    curr_hpp: { type: DataTypes.NUMERIC },
    use_warranty: { type: DataTypes.BOOLEAN },
    valid_warranty_km: { type: DataTypes.NUMERIC },
    valid_warranty_period: { type: DataTypes.INTEGER },

    // [QTY BOOKED]: FERDINAN - 2025-06-02
    qty_booked: { type: DataTypes.INTEGER },

    // [NO BAN]: FERDINAN - 2025-06-20
    isNoReferenceRequired: { type: DataTypes.BOOLEAN },
  }, { tableName: 'vw_stock_list_purchase_price', freezeTableName: true })
}