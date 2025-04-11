/**
 * Created by Veirry on 05/02/2018.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Payment = sequelize.define("vw_payment_001", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        transNo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cashierTransId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        transDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        transTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        typeCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paid: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        nettoTotal: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cardName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cardNo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        printDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        active: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },
        updatedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        }
    }, {
            tableName: 'vw_payment_001'
        })

    return Payment
}
