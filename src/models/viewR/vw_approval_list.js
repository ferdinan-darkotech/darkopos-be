"use strict";

module.exports = function (sequelize, DataTypes) {
  const ApprovalList = sequelize.define("vw_approval_list", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.STRING },
    appvno: { type: DataTypes.STRING },
    appvtype: { type: DataTypes.STRING },
    appvname: { type: DataTypes.STRING },
    othername: { type: DataTypes.STRING },
    appvpayload: { type: DataTypes.JSON },
    reqfromcode: { type: DataTypes.STRING },
    reqfromname: { type: DataTypes.STRING },
	  reqat: { type: DataTypes.DATE },
	  reqby: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    payloads: { type: DataTypes.JSON }
  }, { tableName: 'vw_approval_list', freezeTableName: true, timestamps: false })

  ApprovalList.removeAttribute('id');
  return ApprovalList
}