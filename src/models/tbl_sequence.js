"use strict";

module.exports = function (sequelize, DataTypes) {
    var Sequence = sequelize.define("tbl_sequence", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        seqCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        },
        typeSeq: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        seqName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        seqValue: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        initialChar: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        maxNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        resetType: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        resetDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        oldValue: {
            type: DataTypes.STRING(100),
            allowNull: true
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
            tableName: 'tbl_sequence'
        })

    return Sequence
}