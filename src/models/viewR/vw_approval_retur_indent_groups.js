"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const ApprovalIndent = sequelize.define("vw_approval_retur_indent_groups", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.INTEGER },
    appvno: { type: DataTypes.STRING },
    indentno: { type: DataTypes.STRING },
   	storeid: { type: DataTypes.INTEGER },
   	storecode: { type: DataTypes.STRING },
   	storename: { type: DataTypes.STRING },
   	memberid: { type: DataTypes.INTEGER },
   	membercode: { type: DataTypes.STRING },
   	membername: { type: DataTypes.STRING },
    dpretur: { type: DataTypes.NUMERIC },
    trigger_op: { type: DataTypes.STRING },
    appvrules: { type: DataTypes.JSON },
    data_detail: { type: DataTypes.JSON },
	  reqat: { type: DataTypes.STRING },
	  reqby: { type: DataTypes.STRING },
    reqmemo: { type: DataTypes.STRING },
  }, { tableName: 'vw_approval_retur_indent_groups', freezeTableName: true, timestamps: false })

  ApprovalIndent.removeAttribute('id');
  return ApprovalIndent
}