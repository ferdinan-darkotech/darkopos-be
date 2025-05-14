"use strict";
//id, serviceCode, serviceName, cost, serviceCost, serviceTypeId, createdBy, updatedBy
module.exports = function (sequelize, DataTypes) {
    var Service = sequelize.define("vw_spr_service", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        reg_id: { type: DataTypes.INTEGER },
        reg_code: { type: DataTypes.STRING },
        serviceCode: { type: DataTypes.STRING(30) },
        serviceName: { type: DataTypes.STRING(50) },
        cost: { type: DataTypes.DECIMAL(19, 2) },
        serviceCost: { type: DataTypes.DECIMAL(19, 2) },
        serviceTypeId: { type: DataTypes.STRING(10) },
        reminder_in_day: { type: DataTypes.INTEGER },
        reminder_in_km: { type: DataTypes.FLOAT },
        active: { type: DataTypes.BOOLEAN },
        createdBy: { type: DataTypes.STRING(30) },
        createdAt: { type: DataTypes.DATE },
        updatedBy: { type: DataTypes.STRING(30) },
        updatedAt: { type: DataTypes.DATE },
        sync_at: { type: DataTypes.DATE }
    }, { tableName: 'vw_spr_service', freezeTableName: true, timestamps: false })

    return Service
}
