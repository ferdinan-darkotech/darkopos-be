"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const ApprovalTransferOutG = sequelize.define("vw_approval_transfer_out_groups", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.STRING },
    appvno: { type: DataTypes.STRING },
    appvgroupid: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    storeidreceiver: { type: DataTypes.INTEGER },
    storecodereceiver: { type: DataTypes.STRING },
    storenamereceiver: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transtype: { type: DataTypes.STRING },
    reference: { type: DataTypes.STRING },
    referencedate: { type: DataTypes.STRING },
    transdate: { type: DataTypes.DATE },
    description: { type: DataTypes.STRING },
   	employeeid: { type: DataTypes.INTEGER },
    employeecode: { type: DataTypes.STRING },
    employeename: { type: DataTypes.STRING },
    carnumber: { type: DataTypes.STRING },
    reqat: { type: DataTypes.STRING },
    reqby: { type: DataTypes.STRING },
    reqmemo: { type: DataTypes.STRING },
    appvtype: { type: DataTypes.STRING },
    trigger_op: { type: DataTypes.STRING },
    data_detail: { type: DataTypes.JSON },
    appvby: { type: DataTypes.STRING },
    appvat: { type: DataTypes.STRING },
    appvstatus: { type: DataTypes.STRING },
    appvmemo: { type: DataTypes.STRING },
    appvlvl: { type: DataTypes.STRING },
    appvrules: { type: DataTypes.STRING }
  }, { tableName: 'vw_approval_transfer_out_groups', freezeTableName: true, timestamps: false })

  ApprovalTransferOutG.removeAttribute('id');
  return ApprovalTransferOutG
}