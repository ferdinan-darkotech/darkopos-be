"use strict";

module.exports = function (sequelize, DataTypes) {
    var Transfer = sequelize.define("tbl_transfer_out_detail_hpokok", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        purchaseId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        storeIdReceiver: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        transNo: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        transType: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        qty: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false
        },
        purchasePrice: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        recapDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createdBy: {
            type: DataTypes.STRING(30),
            allowNull: false,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedBy: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },
        updatedAt: { type: DataTypes.DATE, allowNull: true }
    }, {
            tableName: 'tbl_transfer_out_detail_hpokok'
        })

    return Transfer
}