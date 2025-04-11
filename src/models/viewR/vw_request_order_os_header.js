"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_request_order_os_header", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storename: { type: DataTypes.STRING },
    storeidreceiver: { type: DataTypes.INTEGER },
    storenamereceiver: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.STRING },
    categorycode: { type: DataTypes.STRING },
    categoryname: { type: DataTypes.STRING },
    transmemo: { type: DataTypes.STRING }
    
  }, { tableName: 'vw_request_order_os_header', freezeTableName: true, timestamps: false  })
}