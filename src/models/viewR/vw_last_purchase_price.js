"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_last_purchase_price", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    productid: { type: DataTypes.INTEGER },
    lst_purchaseprice: { type: DataTypes.INTEGER }
  }, { tableName: 'vw_last_purchase_price', freezeTableName: true, timestamps: false })
}