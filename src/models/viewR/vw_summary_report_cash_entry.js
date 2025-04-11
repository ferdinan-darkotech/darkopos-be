"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const CashEntry = sequelize.define("vw_summary_report_cash_entry", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdateval: { type: DataTypes.DATE },
    transdate: { type: DataTypes.STRING },
    transtypecode: { type: DataTypes.STRING },
    transtypename: { type: DataTypes.STRING },
    transkindcode: { type: DataTypes.STRING },
    transkindname: { type: DataTypes.STRING },
    cashierid: { type: DataTypes.STRING },
    cashiername: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    totalbalance: { type: DataTypes.NUMERIC(19, 2) }
  }, { tableName: 'vw_summary_report_cash_entry', freezeTableName: true, timestamps: false })
  CashEntry.removeAttribute('id')
  return CashEntry
}
