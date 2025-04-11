"use strict";

module.exports = function (sequelize, DataTypes) {
  const logStock = sequelize.define("vw_log_update_stock_price", {
    // id: { type: DataTypes.INTEGER, primaryKey: true },
    productid: { type: DataTypes.INTEGER },
    storeid: { type: DataTypes.STRING },
    productcode: { type: DataTypes.INTEGER },
    productname: { type: DataTypes.STRING },
    costprice: { type: DataTypes.NUMERIC(16,2) },
    sellprice: { type: DataTypes.NUMERIC(16,2) },
    sellpricepre: { type: DataTypes.NUMERIC(16,2) },
    distprice01: { type: DataTypes.NUMERIC(16,2) },
    distprice02: { type: DataTypes.NUMERIC(16,2) },
    old_costprice: { type: DataTypes.NUMERIC(16,2) },
    old_sellprice: { type: DataTypes.NUMERIC(16,2) },
    old_sellpricepre: { type: DataTypes.NUMERIC(16,2) },
    old_distprice01: { type: DataTypes.NUMERIC(16,2) },
    old_distprice02: { type: DataTypes.NUMERIC(16,2) },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE }
    
  }, { tableName: 'vw_log_update_stock_price', freezeTableName: true, timestamps: false  })
  logStock.removeAttribute('id');
  return logStock
}