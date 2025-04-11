/**
 * Created by Veirry on 18/09/2017.
 */
"use strict";
import moment from 'moment'

module.exports = function(sequelize, DataTypes) {
    var Report_service = sequelize.define("vw_report_pos_trans_cancel", {
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
        dpp: {
            type: DataTypes.DECIMAL(19,2),
        },
        netto: {
            type: DataTypes.DECIMAL(19,2),
        },
        status: {
            type: DataTypes.STRING(5),
        },
        memo: {
            type: DataTypes.STRING(100),
        },
    }, {
        tableName: 'vw_report_pos_trans_cancel'
    })

    return Report_service
}