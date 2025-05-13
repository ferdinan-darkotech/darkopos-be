/**
 * Created by Silzzz88 on 5/26/2017.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Pos_Detail = sequelize.define("tbl_pos_detail", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bundlingId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        transNo: {
            type: DataTypes.STRING(30),
            allowNull: false,
            validate: {
                is: /^[a-z0-9\_]{6,30}$/i
            }
        },
        productId: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
        },
        productCode: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        qty: {
            type: DataTypes.DECIMAL(11, 2),
            allowNull: false
        },
        sellPrice: {
            type: DataTypes.DECIMAL(11, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'From sellPrice Column tbl_stock'
        },
        sellingPrice: {
            type: DataTypes.DECIMAL(11, 2),
            allowNull: false
        },
        discountLoyalty: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        discount: {
            type: DataTypes.DECIMAL(11, 2),
            allowNull: false
        },
        disc1: {
            type: DataTypes.DECIMAL(11, 3),
            allowNull: false
        },
        disc2: {
            type: DataTypes.DECIMAL(11, 3),
            allowNull: false
        },
        disc3: {
            type: DataTypes.DECIMAL(11, 3),
            allowNull: false
        },
        DPP: {
            type: DataTypes.DECIMAL(11, 6),
            allowNull: false,
            defaultValue: 0
        },
        PPN: {
            type: DataTypes.DECIMAL(11, 6),
            allowNull: false,
            defaultValue: 0
        },
        max_disc_percent: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: true,
            defaultValue: null
        },
        max_disc_nominal: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: true,
            defaultValue: null
        },
        trade_in_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        trade_in_qty: { 
            type: DataTypes.NUMERIC(19,0),
            allowNull: true,
            defaultValue: 0
        },
        trade_in_price: {
            type: DataTypes.NUMERIC(16,5),
            allowNull: true,
            defaultValue: 0
        },
        trade_in_ttl_price: {
            type: DataTypes.NUMERIC(16,5),
            allowNull: true,
            defaultValue: 0
        },
        typeCode: {
            type: DataTypes.STRING(1),
            allowNull: true,
        },
        indentid: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        queue_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        keterangan: {
            type: DataTypes.STRING,
            allowNull: true
        },
        updatestock: { type: DataTypes.BOOLEAN, allowNull: false },
        voucherid: { type: DataTypes.INTEGER, allowNull: true },
        createdBy: { type: DataTypes.STRING, allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedBy: { type: DataTypes.STRING, allowNull: true },
        updatedAt: { type: DataTypes.DATE, allowNull: true },
        appdata: { type: DataTypes.BOOLEAN, allowNull: true },
        appmemo: { type: DataTypes.STRING, allowNull: true },
        appstatus: { type: DataTypes.STRING, allowNull: true },
        appby: { type: DataTypes.STRING, allowNull: true },
        appdt: { type: DataTypes.DATE, allowNull: true },

        // [NEW]: FERDINAN - 2025-03-25
        salestype: { type: DataTypes.STRING },
        additionalpricenominal: { type: DataTypes.INTEGER },
        additionalpricepercent: { type: DataTypes.INTEGER },
        additionalpriceroundingdigit: { type: DataTypes.INTEGER },

        // [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
        transnopurchase: { type: DataTypes.STRING, allowNull: true },
    }, {
            tableName: 'tbl_pos_detail'
        })

    return Pos_Detail
}
