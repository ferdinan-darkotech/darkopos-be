"use strict";

module.exports = function (sequelize, DataTypes) {
    var Pos_Detail = sequelize.define("vw_pos_detail", {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        typeCode: { type: DataTypes.STRING },
        bundlingId: { type: DataTypes.INTEGER },
        bundlingCode: { type: DataTypes.STRING },
        bundlingName: { type: DataTypes.STRING },
        storeId: { type: DataTypes.INTEGER },
        transNo: { type: DataTypes.STRING },
        productId: { type: DataTypes.INTEGER },
        serviceCode: { type: DataTypes.STRING },
        serviceName: { type: DataTypes.STRING },
        productCode: { type: DataTypes.STRING },
        productName: { type: DataTypes.STRING },
        qty: { type: DataTypes.NUMERIC },
        sellPrice: { type: DataTypes.NUMERIC },
        sellingPrice: { type: DataTypes.NUMERIC },
        discountLoyalty: { type: DataTypes.NUMERIC },
        discount: { type: DataTypes.NUMERIC },
        disc1: { type: DataTypes.NUMERIC },
        disc2: { type: DataTypes.NUMERIC },
        disc3: { type: DataTypes.NUMERIC },
        dpp: { type: DataTypes.NUMERIC },
        ppn: { type: DataTypes.NUMERIC },
        trade_in_id: { type: DataTypes.STRING },
        keterangan: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE },

        // [NEW]: FERDINAN - 2025-03-25
        salestype: { type: DataTypes.STRING(1) },
        additionalpricenominal: { type: DataTypes.INTEGER },
        additionalpricepercent: { type: DataTypes.INTEGER },
        additionalpriceroundingdigit: { type: DataTypes.INTEGER }
    }, { tableName: 'vw_pos_detail' })

    return Pos_Detail
}
