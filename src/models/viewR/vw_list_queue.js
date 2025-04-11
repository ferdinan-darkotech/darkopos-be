/**
 * Created by Silzzz88 on 5/26/2017.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Queue_Approval = sequelize.define("vw_list_queue", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        queuenumber: { type: DataTypes.STRING },
        storeid: { type: DataTypes.INTEGER },
        woid: { type: DataTypes.INTEGER },
        wono: { type: DataTypes.STRING },
        headerid: { type: DataTypes.STRING },
        membername: { type: DataTypes.STRING },
        policeno: { type: DataTypes.STRING },
        status: { type: DataTypes.BOOLEAN },
        statustext: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE },
        request_stock_out: { type: DataTypes.JSON },
    }, {
            tableName: 'vw_list_queue',
            freezeTableName: true
        })
    Queue_Approval.removeAttribute('id');  
    return Queue_Approval
}

