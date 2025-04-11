"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
    var Transfer = sequelize.define("vw_transfer_out", {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        storeId: { type: DataTypes.INTEGER },
        storeName: { type: DataTypes.STRING },
        storeIdReceiver: { type: DataTypes.INTEGER },
        storeNameReceiver: { type: DataTypes.STRING },
        transNo: { type: DataTypes.STRING },
        reference: { type: DataTypes.STRING },
        transType: { type: DataTypes.STRING },
        employeeId: { type: DataTypes.INTEGER },
        employeeName: { type: DataTypes.STRING },
        carNumber: { type: DataTypes.STRING },
        status: { type: DataTypes.TINYINT },
        active: { type: DataTypes.TINYINT },
        referencedate: {
            type: DataTypes.DATE,
            get() {
                return this.getDataValue('referencedate') ? moment(this.getDataValue('referencedate')).format('YYYY-MM-DD') : null
            }
        },
        transDate: {
            type: DataTypes.DATE,
            get() {
                return this.getDataValue('transDate') ? moment(this.getDataValue('transDate')).format('YYYY-MM-DD') : null
            }
        },
        totalPackage: { type: DataTypes.TINYINT },
        description: { type: DataTypes.STRING },
        memo: { type: DataTypes.STRING },
        createdBy: { type: DataTypes.STRING },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return this.getDataValue('createdAt') ? moment(this.getDataValue('createdAt')).format('YYYY-MM-DD hh:mm:ss') : null
            }
        },
        updatedBy: { type: DataTypes.STRING },
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                return this.getDataValue('updatedAt') ? moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD hh:mm:ss') : null
            }
        }
    }, { tableName: 'vw_transfer_out' })
    return Transfer
}
