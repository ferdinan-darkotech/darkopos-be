"use strict";

module.exports = function (sequelize, DataTypes) {
    var Transfer = sequelize.define("tbl_transfer_in_detail", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.INTEGER(11),
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
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        qty: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: false
        },
        description: {
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
        updatestock: { type: DataTypes.BOOLEAN, allowNull: false },
        updatedBy: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },
        updatedAt: { type: DataTypes.DATE, allowNull: true }
    }, {
        tableName: 'tbl_transfer_in_detail'
    })

    return Transfer
}