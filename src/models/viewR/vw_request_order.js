"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_request_order", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storename: { type: DataTypes.STRING },
    storeidreceiver: { type: DataTypes.INTEGER },
    storenamereceiver: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.STRING },
    categorycode: { type: DataTypes.STRING },
    categoryname: { type: DataTypes.STRING },
    transmemo: { type: DataTypes.STRING },
    closestatus: { type: DataTypes.STRING },
    closeby: { type: DataTypes.STRING },
    closedate: { type: DataTypes.STRING },
    closememo: { type: DataTypes.STRING },
    createdby: { type: DataTypes.STRING },
    updatedby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedat: { type: DataTypes.DATE }
    
  }, { tableName: 'vw_request_order', freezeTableName: true, timestamps: false })
}