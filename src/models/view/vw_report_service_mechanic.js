"use strict";
import moment from 'moment'

module.exports = function(sequelize, DataTypes) {
    var Report_service_mechanic = sequelize.define("vw_report_service_mechanic", {
        transDate: {
            type: DataTypes.STRING,
            get() {
              return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
            }
        },
        transNo: {
            type: DataTypes.STRING(30),
        },
        status: {
            type: DataTypes.STRING(1),
        },
        technicianId: {
            type: DataTypes.STRING(30),
        },
        employeeName: {
            type: DataTypes.STRING(30),
        },
        productId: {
            type: DataTypes.INTEGER(11),
        },
        serviceCode: {
            type: DataTypes.STRING(30),
        },
        serviceName: {
            type: DataTypes.STRING(60),
        },
        qty: {
            type: DataTypes.DECIMAL(19,2),
        },
        sellingPrice: {
            type: DataTypes.DECIMAL(19,2),
        },
        amount: {
            type: DataTypes.DECIMAL(19,2),
        }
    }, {
        tableName: 'vw_report_service_mechanic'
    })

    return Report_service_mechanic
}
