/**
 * Created by Veirry on 05/02/2018.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Payment = sequelize.define("tbl_payment", {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true
        },
        cashierTransId: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
            defaultValue: null
        },
        reference: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        storeId: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
        },
        storeIdPayment: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
        },
        transDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        typeCode: {
            type: DataTypes.STRING(3),
            allowNull: false,
        },
        paymentOptionId: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
        },
        edcId: {
            type: DataTypes.INTEGER(2),
            allowNull: true,
        },
        amount: {
            type: DataTypes.DECIMAL(19.2),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        cardName: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        cardInfo: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        cardDescription: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        cardNo: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        printDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        active: {
            type: DataTypes.STRING(1),
            allowNull: true,
        },
        memo: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        indentno: {
            type: DataTypes.STRING,
            allowNull: true,
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
            tableName: 'tbl_payment'
        })

    return Payment
}
