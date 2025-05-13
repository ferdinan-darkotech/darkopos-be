"use strict";
import moment from 'moment'

module.exports = function(sequelize, DataTypes) {
    var Report_service_mechanic = sequelize.define("vw_report_rbb_product", {
        transDate: {
            type: DataTypes.STRING,
            get() {
              return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
            }
          },
        transNo: {
            type: DataTypes.STRING(30),
        },
        transType: {
            type: DataTypes.STRING(30),
        },
        reference: {
            type: DataTypes.STRING(30),
        },
        memo: {
            type: DataTypes.STRING(100),
        },
        productId: {
            type: DataTypes.INTEGER,
        },
        productCode: {
            type: DataTypes.STRING(30),
        },
        productName: {
            type: DataTypes.STRING(60),
        },
        qty: {
            type: DataTypes.DECIMAL(19,2),
        },
        amount: {
            type: DataTypes.DECIMAL(19,2),
        }
    }, {
        tableName: 'vw_report_rbb_product'
    })

    return Report_service_mechanic
}
