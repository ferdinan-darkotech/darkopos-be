"use strict";

module.exports = function (sequelize, DataTypes) {
  var View = sequelize.define("vw_account_code", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    sort: { type: DataTypes.INTEGER },
    accountCode: { type: DataTypes.STRING },
    accountName: { type: DataTypes.STRING },
    accountParentId: { type: DataTypes.INTEGER },
    accountParentCode: { type: DataTypes.STRING },
    accountParentName: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_account_code' })
  return View
}
