"use strict";

module.exports = function (sequelize, DataTypes) {
  const ApprovalPurchaseDetail = sequelize.define("tbl_tmp_purchase_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    transno: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    qty: { type: DataTypes.NUMERIC },
    purchaseprice: { type: DataTypes.NUMERIC },
    sellingprice: { type: DataTypes.NUMERIC },
    discp1: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
      defaultValue: 0
    },
    discp2: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0
    },
    discp3: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0
    },
    discp4: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0
    },
    discp5: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0
    },
    discnominal: { type: DataTypes.NUMERIC },
    dpp: { type: DataTypes.NUMERIC },
    ppn: { type: DataTypes.NUMERIC },
    closed: { type: DataTypes.STRING(1) },
    recapdate: { type: DataTypes.DATE },
    void: { type: DataTypes.CHAR(1) },
    rounding_netto: { type: DataTypes.NUMERIC },
    rounding_ppn: { type: DataTypes.NUMERIC },
    rounding_dpp: { type: DataTypes.NUMERIC },
    createdby: { type: DataTypes.STRING },
    updatedby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedat: { type: DataTypes.DATE },
    action_type: { type: DataTypes.STRING }
  }, { tableName: 'tbl_tmp_purchase_detail', freezeTableName: true, timestamps: false })

  ApprovalPurchaseDetail.removeAttribute('id');
  return ApprovalPurchaseDetail
}






























