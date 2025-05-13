"use strict";

module.exports = function(sequelize, DataTypes) {
    var Report_pos = sequelize.define("vw_report_pos", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        transNo: {
            type: DataTypes.STRING(30),
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
        Qty: {
            type: DataTypes.DECIMAL(32,0),
        },
        Total: {
            type: DataTypes.DECIMAL(42,0),
        },
        discount: {
            type: DataTypes.DECIMAL(42,0),
        },
        disc1Total: {
            type: DataTypes.DECIMAL(56,4),
        },
        disc2Total: {
            type: DataTypes.DECIMAL(65,8),
        },
        disc3Total: {
            type: DataTypes.DECIMAL(65,12),
        },
        discountTotal: {
            type: DataTypes.DECIMAL(65,12),
        },
        createdAt: {
            type: DataTypes.DATEONLY,
        }
    }, {
        tableName: 'vw_report_pos'
    })

    return Report_pos
}
