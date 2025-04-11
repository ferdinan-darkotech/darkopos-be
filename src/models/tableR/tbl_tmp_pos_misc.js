/**
 * Created by Silzzz88 on 5/26/2017.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Pos_Misc = sequelize.define("tbl_tmp_pos_misc", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        headerid: {
            type: DataTypes.STRING,
            primaryKey: false
        },
        storeid: {
            type: DataTypes.STRING,
            primaryKey: false
        },
        objecttype: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dataobject: {
            type: DataTypes.JSON,
            allowNull: false
        }
    }, {
            tableName: 'tbl_tmp_pos_misc',
            timestamps: false
        })

    return Pos_Misc
}
