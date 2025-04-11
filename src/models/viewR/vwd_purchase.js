"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const vwdPurchase = sequelize.define("vwd_purchase", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    supplierid: { type: DataTypes.INTEGER },
    suppliercode: { type: DataTypes.STRING },
    suppliername: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.DATE },
    receivedate: { type: DataTypes.DATE },
    duedate: { type: DataTypes.DATE },
    recapdate: { type: DataTypes.DATE },
    taxtype: { type: DataTypes.STRING },
    taxpercent: { type: DataTypes.NUMERIC(16,2) },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    purchaseprice: { type: DataTypes.STRING },
    qty: { type: DataTypes.NUMERIC(16, 0) },
    discp1: { type: DataTypes.NUMERIC(16,2) },
    discp2: { type: DataTypes.NUMERIC(16,2) },
    discp3: { type: DataTypes.NUMERIC(16,2) },
    discp4: { type: DataTypes.NUMERIC(16,2) },
    discp5: { type: DataTypes.NUMERIC(16,2) },
    discnominal: { type: DataTypes.NUMERIC(16,2) },
    dpp: { type: DataTypes.NUMERIC(16,2) },
    ppn: { type: DataTypes.NUMERIC(16,2) },
    netto: { type: DataTypes.NUMERIC(16,2) },
    rounding_dpp: { type: DataTypes.NUMERIC(16,2) },
    rounding_ppn: { type: DataTypes.NUMERIC(16,2) },
    rounding_netto: { type: DataTypes.NUMERIC(16,2) },
    status: { type: DataTypes.BOOLEAN }
  }, { tableName: 'vwd_purchase', freezeTableName: true, timestamps: false })
  vwdPurchase.removeAttribute('id')
  return vwdPurchase
}