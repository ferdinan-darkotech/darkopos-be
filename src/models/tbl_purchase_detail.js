"use strict";

module.exports = function (sequelize, DataTypes) {
    var Purchase_Detail = sequelize.define("tbl_purchase_detail", {
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
            validate: {
                is: /^[a-z0-9\-_ ]{1,30}$/i
            }
        },
        // productName: {
        //     type: DataTypes.STRING(60),
        //     allowNull: false,
        // },
        qty: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false
        },
        purchasePrice: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false
        },
        sellingPrice: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false
        },
        discp1: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: true,
            defaultValue: 0
        },
        discp2: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        discp3: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        discp4: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        discp5: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        discNominal: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false
        },
        DPP: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false
        },
        PPN: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false
        },
        void: {
            type: DataTypes.STRING(1),
            allowNull: true
        },
        closed: {
            type: DataTypes.STRING(1),
            allowNull: false,
        },
        recapDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        rounding_netto: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: true
        },
        rounding_ppn: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: true
        },
        rounding_dpp: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: true
        },
        updatestock: { type: DataTypes.BOOLEAN, allowNull: true },
        createdAt: { type: DataTypes.DATE },
        createdBy: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        updatedAt: { type: DataTypes.DATE, allowNull: true },
        updatedBy: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
    }, {
            tableName: 'tbl_purchase_detail'
        })

    return Purchase_Detail
}
