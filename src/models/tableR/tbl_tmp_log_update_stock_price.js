"use strict";

module.exports = function(sequelize, DataTypes) {
  var productPrice = sequelize.define("tbl_tmp_log_update_stock_price", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    productid: { type: DataTypes.INTEGER, allowNull: false },
    storeid: { type: DataTypes.INTEGER, allowNull: false },
    costprice: { type: DataTypes.NUMERIC, allowNull: true, defaultValue: 0 },
    sellprice: { type: DataTypes.NUMERIC, allowNull: true, defaultValue: 0 },
    sellpricepre: { type: DataTypes.NUMERIC, allowNull: true, defaultValue: 0 },
    distprice01: { type: DataTypes.NUMERIC, allowNull: true, defaultValue: 0 },
    distprice02: { type: DataTypes.NUMERIC, allowNull: true, defaultValue: 0 },
    old_costprice: { type: DataTypes.NUMERIC, allowNull: true, defaultValue: 0 },
    old_sellprice: { type: DataTypes.NUMERIC, allowNull: true, defaultValue: 0 },
    old_sellpricepre: { type: DataTypes.NUMERIC, allowNull: true, defaultValue: 0 },
    old_distprice01: { type: DataTypes.NUMERIC, allowNull: true, defaultValue: 0 },
    old_distprice02: { type: DataTypes.NUMERIC, allowNull: true, defaultValue: 0 },
    createdby: { type: DataTypes.STRING, allowNull: false },
    createdat: { type: DataTypes.DATE, allowNull: false },
    old_status: { type: DataTypes.BOOLEAN, allowNull: true },
    new_status: { type: DataTypes.BOOLEAN, allowNull: true }
  }, {
    tableName: 'tbl_tmp_log_update_stock_price',
    freezeTableName: true,
    timestamps: false
  })

  return productPrice
}