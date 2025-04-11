// [NEW]: FERDINAN - 2025-03-06
"use strict";

module.exports = function (sequelize, DataTypes) {
    var requestStockOut = sequelize.define("vw_request_stock_out", {
        storeid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        storename: {
            type: DataTypes.STRING(50),
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
        created_by_fullname: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        updatedBy: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },
        createdat: { type: DataTypes.DATE, allowNull: false },
        updatedat: { type: DataTypes.DATE, allowNull: true },

        // [NEW]: FERDINAN - 2025-03-28
        statuscancel: { type: DataTypes.STRING },
        cancel_by_fullname: { type: DataTypes.STRING },
        cancelat: { type: DataTypes.DATE },
        memocancel: { type: DataTypes.STRING },

        // [NEW]: FERDINAN - 2025-04-08
        reqat: { type: DataTypes.DATE },
        reqby: { type: DataTypes.STRING },
        appvid: { type: DataTypes.STRING },
        appvno: { type: DataTypes.STRING },
        appvstatus: { type: DataTypes.STRING },
        appvgroupid: { type: DataTypes.STRING },
        appvlvl: { type: DataTypes.INTEGER },
        statusapproval: { type: DataTypes.STRING },
        data_detail: { type: DataTypes.JSON },
    }, {
            tableName: 'vw_request_stock_out'
        })

    return requestStockOut
}
