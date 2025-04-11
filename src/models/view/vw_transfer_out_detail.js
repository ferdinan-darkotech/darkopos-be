"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
    var Transfer = sequelize.define("vw_transfer_out_detail", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    transNoId: { type: DataTypes.INTEGER },
    storeId: { type: DataTypes.INTEGER },
    storeName: { type: DataTypes.STRING },
    storeIdReceiver: { type: DataTypes.INTEGER },
    storeNameReceiver: { type: DataTypes.STRING },
    transNo: { type: DataTypes.STRING },
    transDate: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
      }
    },
    reference: { type: DataTypes.STRING },
    referenceDate: { type: DataTypes.DATE },
    transType: { type: DataTypes.STRING },
    productId: { type: DataTypes.INTEGER },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    qty: { type: DataTypes.NUMERIC },
    purchasePrice: { type: DataTypes.NUMERIC },
    nettoTotal: { type: DataTypes.NUMERIC },
    status: { type: DataTypes.TINYINT },
    active: { type: DataTypes.TINYINT },
    description: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE }
    }, {
        tableName: 'vw_transfer_out_detail'
    })
    return Transfer
}