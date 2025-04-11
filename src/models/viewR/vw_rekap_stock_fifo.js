"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const vwFifo = sequelize.define("vw_rekap_stock_fifo", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeId: { type: DataTypes.INTEGER },
    storeCode: { type: DataTypes.STRING },
    storeName: { type: DataTypes.STRING },
    periode: { type: DataTypes.STRING },
    period: { type: DataTypes.INTEGER },
    year: { type: DataTypes.INTEGER },
    productId: { type: DataTypes.STRING },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    active: { type: DataTypes.INTEGER },
    beginQty: { type: DataTypes.DECIMAL },
    beginPrice: { type: DataTypes.DECIMAL },
    purchaseQty: { type: DataTypes.DECIMAL },
    beginPrice: { type: DataTypes.DECIMAL },
    adjInQty: { type: DataTypes.DECIMAL },
    adjInPrice: { type: DataTypes.DECIMAL },
    adjOutQty: { type: DataTypes.DECIMAL },
    adjOutPrice: { type: DataTypes.DECIMAL },
    posQty: { type: DataTypes.DECIMAL },
    posPrice: { type: DataTypes.DECIMAL },
    transferInQty: { type: DataTypes.DECIMAL },
    transferInPrice: { type: DataTypes.DECIMAL },
    transferOutQty: { type: DataTypes.DECIMAL },
    transferOutPrice: { type: DataTypes.DECIMAL },
    inTransferQty: { type: DataTypes.DECIMAL },
    inTransferPrice: { type: DataTypes.DECIMAL },
    inTransitQty: { type: DataTypes.DECIMAL },
    inTransitPrice: { type: DataTypes.DECIMAL }
  }, { tableName: 'vw_rekap_stock_fifo', freezeTableName: true, timestamps: false })
  vwFifo.removeAttribute('id')
  return vwFifo
}