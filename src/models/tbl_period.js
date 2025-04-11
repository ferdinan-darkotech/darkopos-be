/**
 * Created by Veirry on 22/09/2017.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Period = sequelize.define("tbl_period", {
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
        startPeriod: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        endPeriod: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        memo: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },
        active: {
            type: DataTypes.STRING(1),
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
        tableName: 'tbl_period'
    })

    return Period
}