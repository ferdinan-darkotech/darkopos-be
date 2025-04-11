"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_request_order_os_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storename: { type: DataTypes.STRING },
    storeidreceiver: { type: DataTypes.INTEGER },
    storenamereceiver: { type: DataTypes.STRING },
    qtyonhandreceiver: { type: DataTypes.NUMERIC },
    transno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    categorycode: { type: DataTypes.STRING },
    categoryname: { type: DataTypes.STRING },
    transmemo: { type: DataTypes.STRING },
    qtyrequest: { type: DataTypes.NUMERIC(16,2) },
    qtyprocess: { type: DataTypes.NUMERIC(16,2) },
    qtyos: { type: DataTypes.NUMERIC(16,2) }
    
  }, { tableName: 'vw_request_order_os_detail', freezeTableName: true, timestamps: false  })
}