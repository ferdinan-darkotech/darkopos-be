/**
 * Created by Silzzz88 on 5/26/2017.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Queue_Approval = sequelize.define("vw_queue_approval", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        headerid: { type: DataTypes.STRING },
        member: { type: DataTypes.STRING },
        unit: { type: DataTypes.STRING },
        queuenumber: { type: DataTypes.STRING },
        storeid: { type: DataTypes.INTEGER },
        storecode: { type: DataTypes.STRING },
        storename: { type: DataTypes.STRING },
        productid: { type: DataTypes.INTEGER },
        productcode: { type: DataTypes.STRING },
        productname: { type: DataTypes.STRING },
        categorycode: { type: DataTypes.STRING },
        categoryname: { type: DataTypes.STRING },
        max_disc: { type: DataTypes.NUMERIC(16,5) },
        qty: { type: DataTypes.NUMERIC(11,2) },
        price: { type: DataTypes.NUMERIC(19, 2) },
        sellingPrice: { type: DataTypes.NUMERIC(11, 2) },
        discountLoyalty: { type: DataTypes.DECIMAL(19, 6) },
        discount: { type: DataTypes.NUMERIC(11, 2) },
        disc1: { type: DataTypes.NUMERIC(11, 3) },
        disc2: { type: DataTypes.NUMERIC(11, 3) },
        disc3: { type: DataTypes.NUMERIC(11, 3) },
        total: { type: DataTypes.NUMERIC(11, 6) },
        createdBy: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedBy: { type: DataTypes.STRING },
        updatedAt: { type: DataTypes.DATE },
        appdata: { type: DataTypes.BOOLEAN },
        appmemo: { type: DataTypes.STRING },
        appstatus: { type: DataTypes.STRING },
        appby: { type: DataTypes.STRING },
        appdt: { type: DataTypes.DATE },
        history_member: { type: DataTypes.JSON },
        typecode: { type: DataTypes.STRING }
    }, {
            tableName: 'vw_queue_approval',
            freezeTableName: true
        })
    Queue_Approval.removeAttribute('id');  
    return Queue_Approval
}

