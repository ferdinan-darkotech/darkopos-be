/**
 * Created by Silzzz88 on 6/22/2017.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var CreditCharge = sequelize.define("tbl_credit_charge", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        creditCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            validate: {
                is: /^[a-z0-9\_]{1,10}$/i
            }
        },
        creditDesc: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                is: /^[a-z0-9\_]{1,50}$/i
            }
        },
        creditCharge: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        tableName: 'tbl_credit_charge'
    })

    return CreditCharge
}