"use strict";

module.exports = function (sequelize, DataTypes) {
  const Approval = sequelize.define("tbl_approval", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.STRING },
    appvno: { type: DataTypes.STRING, allowNull: true },
    appvgroupid: { type: DataTypes.STRING },
    appvtype: { type: DataTypes.STRING },
    appvname: { type: DataTypes.STRING },
    appvpayload: { type: DataTypes.JSON },
    storeid: { type: DataTypes.INTEGER, allowNull: false },
	  reqat: { type: DataTypes.DATE },
	  reqby: { type: DataTypes.STRING },
    reqmemo: { type: DataTypes.STRING },
    trigger_op: { type: DataTypes.STRING }
  }, { tableName: 'tbl_approval', freezeTableName: true, timestamps: false })

  Approval.removeAttribute('id');
  return Approval
}