"use strict";

module.exports = function (sequelize, DataTypes) {
    var Purchase_Detail = sequelize.define("tbl_purchase_detail_cancel", {
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transNo: {
            type: DataTypes.STRING(30),
            allowNull: false,
            validate: {
                is: /^[a-z0-9\/-]{6,30}$/i
            }
        },
        productId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        productName: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        qty: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: false
        },
        purchasePrice: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: false
        },
        sellingPrice: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: false
        },
        discPercent: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: false
        },
        discNominal: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: false
        },
        DPP: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: false
        },
        PPN: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: false
        },
        recapDate: { type: DataTypes.DATE, allowNull: false },
        createdBy: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedBy: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        updatedAt: { type: DataTypes.DATE, allowNull: true },
    }, {
        tableName: 'tbl_purchase_detail_cancel'
    })

    return Purchase_Detail
}
