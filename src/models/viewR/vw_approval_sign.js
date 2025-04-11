"use strict";

module.exports = function (sequelize, DataTypes) {
  const ApprovalSign = sequelize.define("vw_approval_sign", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.STRING },
    appvgroupid: { type: DataTypes.STRING },
    appvtype: { type: DataTypes.STRING },
    appvname: { type: DataTypes.STRING },
    appvpayload: { type: DataTypes.JSON },
	  reqat: { type: DataTypes.DATE },
	  reqby: { type: DataTypes.STRING },
    reqmemo: { type: DataTypes.STRING },
    appvstatus: { type: DataTypes.STRING },
    trigger_op: { type: DataTypes.STRING }
  }, { tableName: 'vw_approval_sign', freezeTableName: true, timestamps: false })

  ApprovalSign.removeAttribute('id');
  return ApprovalSign
}