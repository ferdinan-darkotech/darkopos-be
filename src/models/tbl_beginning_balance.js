/**
 * Created by Veirry on 22/09/2017.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Balance = sequelize.define("tbl_beginning_balance", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transNo: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productName: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        qty: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        purchasePrice: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        sellingPrice: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        discPercent: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        discNominal: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        DPP: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        PPN: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0
        },
        closed: {
            type: DataTypes.STRING(1),
            allowNull: false,
        },
        recapDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        transDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        insertStatus: {
            type: DataTypes.STRING(1),
            allowNull: false,
        },
        startPeriod: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        endPeriod: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        }
    }, {
            tableName: 'tbl_beginning_balance'
        })

    return Balance
}