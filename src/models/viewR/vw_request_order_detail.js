"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_request_order_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storename: { type: DataTypes.STRING },
    storeidreceiver: { type: DataTypes.INTEGER },
    storenamereceiver: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    qty: { type: DataTypes.NUMERIC(16,2) },
    categorycode: { type: DataTypes.STRING },
    categoryname: { type: DataTypes.STRING },
    transmemo: { type: DataTypes.STRING },
    statuscode: { type: DataTypes.STRING },
    statusname: { type: DataTypes.STRING },
    statusby: { type: DataTypes.STRING },
    statusbyname: { type: DataTypes.STRING },
    statusdate: { type: DataTypes.DATE },
    statusremarks: { type: DataTypes.STRING },
    
  }, { tableName: 'vw_request_order_detail', freezeTableName: true, timestamps: false  })
}