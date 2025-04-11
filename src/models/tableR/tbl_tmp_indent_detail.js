"use strict";

module.exports = function (sequelize, DataTypes) {
  const ApprovalIndentDetail = sequelize.define("tbl_tmp_indent_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.STRING },
    referenceid: { type: DataTypes.INTEGER },
    storeid: { type: DataTypes.INTEGER },
    transno: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    qty: { type: DataTypes.DECIMAL(19, 2) },
    returqty: { type: DataTypes.DECIMAL(19, 2) },
    receiveqty: { type: DataTypes.DECIMAL(19, 2) }
  }, { tableName: 'tbl_tmp_indent_detail', freezeTableName: true, timestamps: false })

  ApprovalIndentDetail.removeAttribute('id');
  return ApprovalIndentDetail
}













