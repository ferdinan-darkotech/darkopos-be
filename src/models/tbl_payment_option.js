/**
 * Created by Veirry on 05/02/2018.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Payment = sequelize.define("tbl_payment_option", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        typeCode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        typeName: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        charge: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        cashBackNominal: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        cashBackPercent: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        discNominal: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        discPercent: {
            type: DataTypes.DECIMAL(2, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        createdBy: {
            type: DataTypes.STRING(30),
            allowNull: false,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },
        updatedBy: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        }
    }, {
            tableName: 'tbl_payment_option'
        })

    return Payment
}