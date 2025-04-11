/**
 * Created by Silzzz88 on 5/30/2017.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Unit = sequelize.define("tbl_unit", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        unitCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            validate: {
                is: /^[a-z0-9\_]{1,10}$/i
            }
        },
        unitDescription: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                is: /^[a-z0-9\_]{1,50}$/i
            }
        }
    }, {
        tableName: 'tbl_unit'
    })

    return Unit
}