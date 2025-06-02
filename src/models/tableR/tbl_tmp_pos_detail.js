/**
 * Created by Silzzz88 on 5/26/2017.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Pos_Detail = sequelize.define("tbl_tmp_pos_detail", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        headerid: {
            type: DataTypes.STRING,
            primaryKey: false
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bundleId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        indentid: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        customerreward: {
            type: DataTypes.STRING,
            allowNull: true
        },
        employee: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        qty: {
            type: DataTypes.NUMERIC(11, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        sellingPrice: {
            type: DataTypes.NUMERIC(11, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        sellPrice: {
            type: DataTypes.NUMERIC(19, 2),
            allowNull: true,
            defaultValue: null
        },
        discountLoyalty: {
            type: DataTypes.NUMERIC(19, 6),
            allowNull: true,
            defaultValue: 0.00
        },
        discount: {
            type: DataTypes.NUMERIC(11, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        disc1: {
            type: DataTypes.NUMERIC(11, 3),
            allowNull: true,
            defaultValue: 0.00
        },
        disc2: {
            type: DataTypes.NUMERIC(11, 3),
            allowNull: true,
            defaultValue: 0.00
        },
        disc3: {
            type: DataTypes.NUMERIC(11, 3),
            allowNull: true,
            defaultValue: 0.00
        },
        price: {
            type: DataTypes.NUMERIC(11, 6),
            allowNull: true,
            defaultValue: 0.00
        },
        total: {
            type: DataTypes.NUMERIC(11, 6),
            allowNull: true,
            defaultValue: 0.00
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
        typeCode: {
            type: DataTypes.STRING(1),
            allowNull: true,
        },
        voucherCode: { type: DataTypes.STRING, allowNull: true },
        voucherNo: { type: DataTypes.STRING, allowNull: true },
        createdBy: { type: DataTypes.STRING, allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedBy: { type: DataTypes.STRING, allowNull: true },
        updatedAt: { type: DataTypes.DATE, allowNull: true },
        appdata: { type: DataTypes.BOOLEAN, allowNull: true },
        appmemo: { type: DataTypes.STRING, allowNull: true },
        appstatus: { type: DataTypes.STRING, allowNull: true },
        appby: { type: DataTypes.STRING, allowNull: true },
        appdt: { type: DataTypes.DATE, allowNull: true },
        trade_in: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
        keterangan: { type: DataTypes.STRING, allowNull: true },

        // [NEW]: FERDINAN - 2025-03-25
        salestype: { type: DataTypes.STRING(1) },
        additionalpricenominal: { type: DataTypes.INTEGER },
        additionalpricepercent: { type: DataTypes.INTEGER },
        additionalpriceroundingdigit: { type: DataTypes.INTEGER },

        // [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
        transnopurchase: { type: DataTypes.STRING, allowNull: true },

        // [HPP VALIDATION]: FERDINAN - 2025-05-22
        hppperiod: {
          type: DataTypes.STRING,
          allowNull: true
        },
        hppprice: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
    }, {
            tableName: 'tbl_tmp_pos_detail'
        })
        Pos_Detail.removeAttribute('id');
    return Pos_Detail
}

