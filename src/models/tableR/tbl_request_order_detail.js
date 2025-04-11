"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbl_request_order_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: { type: DataTypes.INTEGER, allowNull: false },
    transno: { type: DataTypes.STRING, allowNull: false },
    productid: { type: DataTypes.INTEGER, allowNull: false },
    productcode: { type: DataTypes.STRING, allowNull: false },
    qty: { type: DataTypes.NUMERIC(16, 2), allowNull: false },
    createdby: { type: DataTypes.STRING, allowNull: true },
    updatedby: { type: DataTypes.STRING, allowNull: true },
    createdat: { type: DataTypes.DATE, allowNull: true },
    updatedat: { type: DataTypes.DATE, allowNull: true },
    statuscode: { type: DataTypes.STRING, allowNull: true },
    statusby: { type: DataTypes.STRING, allowNull: true },
    statusdate: { type: DataTypes.DATE, allowNull: true },
    statusremarks: { type: DataTypes.STRING, allowNull: true },
  }, {
      tableName: 'tbl_request_order_detail',
      freezeTableName: true
    })
}