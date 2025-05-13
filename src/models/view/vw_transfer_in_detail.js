"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
    var Transfer = sequelize.define("vw_transfer_in_detail", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.INTEGER,
        },
        storeCode: {
            type: DataTypes.STRING,
        },
        storeName: {
            type: DataTypes.STRING,
        },
        storeIdSender: {
            type: DataTypes.STRING,
        },
        storeCodeSender: {
            type: DataTypes.STRING,
        },
        storeNameSender: {
            type: DataTypes.STRING,
        },
        transNo: {
            type: DataTypes.STRING(50),
        },
        transDate: {
            type: DataTypes.STRING,
            get() {
                return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
            }
        },
        transType: {
            type: DataTypes.STRING(5),
        },
        productId: {
            type: DataTypes.INTEGER
        },
        productCode: {
            type: DataTypes.STRING(50)
        },
        productName: {
            type: DataTypes.STRING(60)
        },
        qty: {
            type: DataTypes.DECIMAL(19, 2)
        },
        description: {
            type: DataTypes.STRING(200)
        },
        createdBy: {
            type: DataTypes.STRING(30),
        },
        updatedBy: {
            type: DataTypes.STRING(30),
        }
    }, {
        tableName: 'vw_transfer_in_detail'
    })
    return Transfer
}