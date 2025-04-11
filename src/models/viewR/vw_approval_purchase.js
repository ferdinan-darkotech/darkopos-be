"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const ApprovalPurchase = sequelize.define("vw_approval_purchase", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.STRING },
    appvno: { type: DataTypes.STRING },
    specuser: { type: DataTypes.JSON },
    appvgroupid: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    reference: { type: DataTypes.STRING },
    taxtype: { type: DataTypes.STRING },
    taxpercent: { type: DataTypes.STRING },
    transdate: { type: DataTypes.STRING },
    invoicedate: { type: DataTypes.STRING },
    duedate: { type: DataTypes.STRING },
    supplierid: { type: DataTypes.INTEGER },
    suppliercode: { type: DataTypes.STRING },
    suppliername: { type: DataTypes.STRING },
    invoicetype: { type: DataTypes.STRING },
    totalprice: { type: DataTypes.NUMERIC },
    totaldisc: { type: DataTypes.NUMERIC },
    totaldpp: { type: DataTypes.NUMERIC },
    totalppn: { type: DataTypes.NUMERIC },
    totalnetto: { type: DataTypes.NUMERIC },
    memo: { type: DataTypes.STRING },
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
  }, { tableName: 'vw_approval_purchase', freezeTableName: true, timestamps: false })

  ApprovalPurchase.removeAttribute('id');
  return ApprovalPurchase
}