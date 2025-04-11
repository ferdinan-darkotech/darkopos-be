// [NEW]: FERDINAN - 2025-03-06
"use strict";

module.exports = function (sequelize, DataTypes) {
    var requestStockOut = sequelize.define("tbl_request_stock_out", {
        storeid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transactionnumber: {
            type: DataTypes.STRING(30),
            allowNull: false,
            primaryKey: true,
            unique: true,
            validate: {
                is: /^[a-z0-9\_/-]{6,30}$/i
            }
        },
        queuenumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            primaryKey: true,
            unique: true,
            validate: {
                is: /^[a-z0-9\_/-]{6,30}$/i
            }
        },
        status: {
            type: DataTypes.STRING(1),
            allowNull: true
        },
        exitdate: {
            type: DataTypes.DATEONLY,
            allowNull: true
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
        },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: true },

        // [NEW]: FERDINAN - 2025-03-28
        statuscancel: { type: DataTypes.STRING },
        cancelby: { type: DataTypes.STRING },
        cancelat: { type: DataTypes.DATE },
        memocancel: { type: DataTypes.STRING },

        // [NEW]: FERDINAN - 2025-04-08
        appvid: { type: DataTypes.STRING, allowNull: true },
    }, {
            tableName: 'tbl_request_stock_out'
        })

    return requestStockOut
}
