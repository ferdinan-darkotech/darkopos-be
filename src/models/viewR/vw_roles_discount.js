"use strict";

module.exports = function (sequelize, DataTypes) {
  const roleDiscount = sequelize.define("vw_roles_discount", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    categoryid: { type: DataTypes.INTEGER },
    categorycode: { type: DataTypes.STRING },
    categoryname: { type: DataTypes.STRING },
    brandid: { type: DataTypes.INTEGER },
    brandcode: { type: DataTypes.STRING },
    brandname: { type: DataTypes.STRING },
    membergroupid: { type: DataTypes.INTEGER },
    membergroupcode: { type: DataTypes.STRING },
    membergroupname: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    max_disc_percent: { type: DataTypes.DECIMAL(16,5) },
    max_disc_nominal: { type: DataTypes.DECIMAL(16,5) },
    status: { type: DataTypes.BOOLEAN }
  }, { tableName: 'vw_roles_discount', freezeTableName: true, timestamps: false })
  return roleDiscount
}