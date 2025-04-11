"use strict";
import moment from 'moment'

module.exports = function(sequelize, DataTypes) {
    var Report_service = sequelize.define("vw_report_service_trans", {
        transNo: {
            type: DataTypes.STRING(30),
        },
        transDate: {
            type: DataTypes.STRING,
            get() {
              return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
            }
        },
        total: {
            type: DataTypes.DECIMAL(19,2),
        },
        discount: {
            type: DataTypes.DECIMAL(19,2),
        },
        DPP: {
            type: DataTypes.DECIMAL(19,2),
        },
        PPN: {
            type: DataTypes.DECIMAL(19,2),
        },
        netto: {
            type: DataTypes.DECIMAL(19,2),
        },
        status: {
            type: DataTypes.STRING(5),
        }
    }, {
        tableName: 'vw_report_service_trans'
    })

    return Report_service
}
