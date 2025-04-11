"use strict";

module.exports = function (sequelize, DataTypes) {
  const roleDiscountLog = sequelize.define("tbl_role_discount_log", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    discountid: { type: DataTypes.INTEGER },
    storeid: { type: DataTypes.INTEGER },
    categoryid: { type: DataTypes.INTEGER },
    brandid: { type: DataTypes.INTEGER },
    membergroupid: { type: DataTypes.INTEGER },
    productid: { type: DataTypes.INTEGER },
    max_disc_percent: { type: DataTypes.DECIMAL(16,5) },
    max_disc_nominal: { type: DataTypes.DECIMAL(16,5) },
    createdby: { type: DataTypes.STRING(30) },
    createdat: { type: DataTypes.DATE },
    status: { type: DataTypes.BOOLEAN }
  }, { tableName: 'tbl_role_discount_log', freezeTableName: true, timestamps: false })
  return roleDiscountLog
}