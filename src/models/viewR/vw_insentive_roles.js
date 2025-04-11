"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_insentive_roles", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    rolescode: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    storename: { type: DataTypes.STRING },
    storecode: { type: DataTypes.STRING },
    positionid: { type: DataTypes.INTEGER },
    positioncode: { type: DataTypes.STRING },
    positionname: { type: DataTypes.STRING },
    categoryid: { type: DataTypes.INTEGER },
    categorycode: { type: DataTypes.STRING },
    categoryname: { type: DataTypes.STRING },
    brandid: { type: DataTypes.INTEGER },
    brandcode: { type: DataTypes.STRING },
    brandname: { type: DataTypes.STRING },
    instypecode: { type: DataTypes.STRING },
    instypename: { type: DataTypes.STRING },
    insvalue: { type: DataTypes.DECIMAL(19, 2) },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE }
  }, { tableName: 'vw_insentive_roles', freezeTableName: true, timestamps: false })
}