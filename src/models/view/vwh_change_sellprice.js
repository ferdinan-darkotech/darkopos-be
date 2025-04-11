"use strict";

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("vwh_change_sellprice", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    transNo: { type: DataTypes.STRING },
    transDate: { type: DataTypes.DATE },
    period: { type: DataTypes.STRING },
    year: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    statusText: { type: DataTypes.STRING },
    employeeId: { type: DataTypes.INTEGER },
    employeeeCode: { type: DataTypes.STRING },
    employeeName: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vwh_change_sellprice' })
  return Pos
}
