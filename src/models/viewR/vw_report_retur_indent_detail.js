"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const ReportReturIndentDetail = sequelize.define("vw_report_retur_indent_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    indentno: { type: DataTypes.STRING },
    cancelno: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    returqty: { type: DataTypes.NUMERIC },
    cancelbycode: { type: DataTypes.STRING },
    cancelbyname: { type: DataTypes.STRING },
    cancelat: { type: DataTypes.DATE },
  }, { tableName: 'vw_report_retur_indent_detail', freezeTableName: true, timestamps: false })

  ReportReturIndentDetail.removeAttribute('id');
  return ReportReturIndentDetail
}