// [GENERATE XML POS]: FERDINAN - 2025-06-09
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Xml_Pos = sequelize.define("vw_xml_pos", {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        typeCode: { type: DataTypes.STRING },
        bundlingId: { type: DataTypes.INTEGER },
        bundlingCode: { type: DataTypes.STRING },
        bundlingName: { type: DataTypes.STRING },
        storeId: { type: DataTypes.INTEGER },
        transNo: { type: DataTypes.STRING },
        transDate: { type: DataTypes.STRING },
        woId: { type: DataTypes.INTEGER },
        woNo: { type: DataTypes.STRING },
        policeNo: { type: DataTypes.STRING },
        driverName: { type: DataTypes.STRING },
        noReference: { type: DataTypes.STRING },
        memberId: { type: DataTypes.INTEGER },
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
        salestype: { type: DataTypes.STRING },
        additionalpricenominal: { type: DataTypes.INTEGER },
        additionalpricepercent: { type: DataTypes.INTEGER },
        additionalpriceroundingdigit: { type: DataTypes.INTEGER },

        // [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
        transnopurchase: { type: DataTypes.STRING },

        // [HPP VALIDATION]: FERDINAN - 2025-05-22
        hppperiod: {
          type: DataTypes.STRING,
          allowNull: true
        },
        hppprice: {
          type: DataTypes.INTEGER,
          allowNull: true
        },

        // [NO BAN]: FERDINAN - 2025-06-20
        noban: { type: DataTypes.STRING, allowNull: true }
    }, { tableName: 'vw_xml_pos' })

    return Xml_Pos
}
