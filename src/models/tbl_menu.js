"use strict";

module.exports = function (sequelize, DataTypes) {
    var Menu = sequelize.define("tbl_menu", {
        id: {
            type: DataTypes.STRING,
            autoIncrement: true,
            primaryKey: true
        },
        menuId: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            unique: true,
        },
        icon: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        bpid: {
            type: DataTypes.INTEGER(5),
            allowNull: true,
        },
        mpid: {
            type: DataTypes.INTEGER(5),
            allowNull: true,
        },
        sorting: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        route: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.STRING(30),
            allowNull: false,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },
        updatedBy: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        }
    }, {
            tableName: 'tbl_menu'
        })

    return Menu
}