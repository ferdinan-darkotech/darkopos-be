/**
 * Created by Veirry on 29/09/2017.
 */
"use strict";
import moment from 'moment'

module.exports = function(sequelize, DataTypes) {
    var Report_adj_in = sequelize.define("vw_report_adjust_in", {
        productCode: {
            type: DataTypes.STRING(30),
        },
        productName: {
            type: DataTypes.STRING(60),
        },
        transDate: {
            type: DataTypes.STRING,
            get() {
              return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
            }
          },
        qtyIn: {
            type: DataTypes.DECIMAL(19,2),
        },
        costPrice: {
            type: DataTypes.DECIMAL(19,2),
        },
        amount: {
            type: DataTypes.DECIMAL(19,2),
        },
        reference: { type: DataTypes.STRING },
        referencedate: {
            type: DataTypes.STRING,
            get() {
                return moment(this.getDataValue('referencedate')).format('YYYY-MM-DD');
            }
        }

    }, {
        tableName: 'vw_report_adjust_in'
    })

    return Report_adj_in
}
