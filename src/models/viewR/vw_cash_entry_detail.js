"use strict";

module.exports = function (sequelize, DataTypes) {
  const CashEntryDetail = sequelize.define("vw_cash_entry_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    coaid: { type: DataTypes.INTEGER },
    coacode: { type: DataTypes.STRING },
    coaname: { type: DataTypes.STRING },
    divid: { type: DataTypes.INTEGER },
    divcode: { type: DataTypes.STRING },
    divname: { type: DataTypes.STRING },
    deptid: { type: DataTypes.INTEGER },
    deptcode: { type: DataTypes.STRING },
    deptname: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    balance: { type: DataTypes.DECIMAL(19,2) },
    status: { type: DataTypes.BOOLEAN },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_cash_entry_detail', freezeTableName: true, timestamps: false })
  return CashEntryDetail
}