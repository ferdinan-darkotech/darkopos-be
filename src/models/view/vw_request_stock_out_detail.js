// [NEW]: FERDINAN - 2025-03-06
"use strict";

module.exports = function (sequelize, DataTypes) {
    var requestStockOutDetail = sequelize.define("vw_request_stock_out_detail", {
        transactionnumber: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true,
            validate: {
                is: /^[a-z0-9\_/-]{6,30}$/i
            }
        },
        productcode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        qtytrans: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        qtyreceived: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        qty: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },
        created_by_fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        updatedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },

        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: true },

        // [ACCEPT REQUEST STOCK OUT REPORT]: FERDINAN - 2025/06/30
        status: { type: DataTypes.STRING },
        statuscancel: { type: DataTypes.STRING },
        queuenumber: { type: DataTypes.STRING },
        storeid: { type: DataTypes.INTEGER },
        exitdate: { type: DataTypes.DATE },
        requestat: { type: DataTypes.DATE },
        updaterequestat: { type: DataTypes.DATE },
        requestby: { type: DataTypes.STRING },
        updaterequestby: { type: DataTypes.STRING },
        policeno: { type: DataTypes.STRING }
    }, {
            tableName: 'vw_request_stock_out_detail'
        })

    return requestStockOutDetail
}
