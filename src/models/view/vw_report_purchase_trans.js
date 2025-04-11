"use strict";
import moment from 'moment'

module.exports = function(sequelize, DataTypes) {
    var Report_purchase = sequelize.define("vw_report_purchase_trans", {
        transDate: {
            type: DataTypes.STRING,
            get() {
              return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
            }
        },
        supplierName: {
            type: DataTypes.STRING(30),
        },
        taxType: {
            type: DataTypes.STRING(30),
        },
        transNo: {
            type: DataTypes.STRING(30),
        },
        qty: {
            type: DataTypes.DECIMAL(19,2),
        },
        total: {
            type: DataTypes.DECIMAL(19,2),
        },
        discount: {
            type: DataTypes.DECIMAL(19,2),
        },
        dpp: {
            type: DataTypes.DECIMAL(19,2),
        },
        ppn: {
            type: DataTypes.DECIMAL(19,2),
        },
        netto: {
            type: DataTypes.DECIMAL(19,2),
        },
        rounding: {
            type: DataTypes.DECIMAL(19,2),
        }
    }, {
        tableName: 'vw_report_purchase_trans'
    })

    return Report_purchase
}
