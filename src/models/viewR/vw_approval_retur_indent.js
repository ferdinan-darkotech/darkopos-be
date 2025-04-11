"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const ApprovalIndent = sequelize.define("vw_approval_retur_indent", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.INTEGER },
    appvno: { type: DataTypes.STRING },
    specuser: { type: DataTypes.JSON },
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
    appvstatus: { type: DataTypes.STRING },
	  appvby: { type: DataTypes.STRING },
	  appvat: { type: DataTypes.STRING },
	  appvmemo: { type: DataTypes.STRING }
  }, { tableName: 'vw_approval_retur_indent', freezeTableName: true, timestamps: false })

  ApprovalIndent.removeAttribute('id');
  return ApprovalIndent
}