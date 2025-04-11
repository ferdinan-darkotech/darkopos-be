"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_request_order_category", {
    categorycode: { type: DataTypes.STRING },
    categoryname: { type: DataTypes.STRING }
  }, {
      tableName: 'vw_request_order_category',
      freezeTableName: true,
      timestamps: false
    })
}