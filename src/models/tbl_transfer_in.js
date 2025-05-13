"use strict";

module.exports = function (sequelize, DataTypes) {
    var Transfer = sequelize.define("tbl_transfer_in", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        storeIdSender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        transNo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        reference: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        transType: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        carNumber: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        status: {
            type: DataTypes.TINYINT(1),
            allowNull: false
        },
        active: {
            type: DataTypes.TINYINT(1),
            allowNull: false
        },
        transDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        totalPackage: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        memo: {
            type: DataTypes.STRING(200),
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
        tableName: 'tbl_transfer_in'
    })

    return Transfer
}
