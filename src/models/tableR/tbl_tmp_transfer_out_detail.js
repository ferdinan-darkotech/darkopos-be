"use strict";

module.exports = function (sequelize, DataTypes) {
  const ApprovalTransferOut = sequelize.define("tbl_tmp_transfer_out_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    transno: { type: DataTypes.STRING },
    transtype: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    qty: { type: DataTypes.DECIMAL(19, 2) },
    description: { type: DataTypes.DECIMAL(19, 2) }
  }, { tableName: 'tbl_tmp_transfer_out_detail', freezeTableName: true, timestamps: false })

  ApprovalTransferOut.removeAttribute('id');
  return ApprovalTransferOut
}













