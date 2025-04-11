"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const ReportReturIndent = sequelize.define("vw_report_retur_indent", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    indentno: { type: DataTypes.STRING },
    cancelno: { type: DataTypes.STRING },
    dpretur: { type: DataTypes.NUMERIC },
	  totalreturqty: { type: DataTypes.NUMERIC },
	  indentdate: { type: DataTypes.DATE },
    cancelat: { type: DataTypes.DATE },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    returqty: { type: DataTypes.NUMERIC },
    description: { type: DataTypes.STRING },
    cancelbycode: { type: DataTypes.STRING },
    cancelbyname: { type: DataTypes.STRING }
  }, { tableName: 'vw_report_retur_indent', freezeTableName: true, timestamps: false })

  ReportReturIndent.removeAttribute('id');
  return ReportReturIndent
}