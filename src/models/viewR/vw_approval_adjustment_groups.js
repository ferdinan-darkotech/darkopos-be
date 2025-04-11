"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const ApprovalAdjust = sequelize.define("vw_approval_adjustment_groups", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.INTEGER },
    appvno: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.STRING },
    reference: { type: DataTypes.STRING },
    referencedate: { type: DataTypes.STRING },
    transtype: { type: DataTypes.STRING },
    picid: { type: DataTypes.STRING },
    pic: { type: DataTypes.STRING },
    supplierid: { type: DataTypes.INTEGER },
    suppliercode: { type: DataTypes.STRING },
    suppliername: { type: DataTypes.STRING },
    totalprice: { type: DataTypes.NUMERIC },
    returnstatuscode: { type: DataTypes.STRING },
    returnstatusname: { type: DataTypes.STRING },
    trigger_op: { type: DataTypes.STRING },
    data_detail: { type: DataTypes.JSON },
	  reqat: { type: DataTypes.STRING },
	  reqby: { type: DataTypes.STRING },
    reqmemo: { type: DataTypes.STRING },
    appvstatus: { type: DataTypes.STRING },
    appvsign: { type: DataTypes.JSON },
    appvpayload: { type: DataTypes.JSON }
  }, { tableName: 'vw_approval_adjustment_groups', freezeTableName: true, timestamps: false })

  ApprovalAdjust.removeAttribute('id');
  return ApprovalAdjust
}