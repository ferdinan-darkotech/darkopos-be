"use strict";

module.exports = function (sequelize, DataTypes) {
    var Purchase = sequelize.define("tbl_purchase", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transNo: {
            type: DataTypes.STRING(30),
            allowNull: false,
            primaryKey: true,
            unique: true,
            validate: {
                is: /^[a-z0-9\_/-]{6,30}$/i
            }
        },
        transDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        receiveDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        receiveby: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // receivestatus: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: true
        // },
        invoiceDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        supplierCode: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        taxType: {
            type: DataTypes.STRING(1),
            allowNull: false
        },
        taxPercent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        reference: {
            type: DataTypes.STRING(40),
            allowNull: true,
	        unique: true,
            validate: {
                is: /^[a-z0-9\_ ,&*)(-/+~]{1,40}$/i
            }
        },
        memo: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(1),
            allowNull: true,
            defaultValue: '1'
        },
        transType: {
            type: DataTypes.STRING(5),
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_]{1,5}$/i
            }
        },
        createdBy: {
            type: DataTypes.STRING(30),
            allowNull: true,
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
        },
        printNo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tempo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        invoiceType: {
            type: DataTypes.STRING(1),
            allowNull: true,
            defaultValue: 'C'
        },
        taxId: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        discInvoiceNominal: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: true,
            defaultValue: 0
        },
        discInvoicePercent: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: true,
            defaultValue: 0
        },
        rounding: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: true
        },
        totalprice: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        totaldisc: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        totaldpp: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        totalppn: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        totalnetto: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        memo_receive: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
            tableName: 'tbl_purchase'
        })

    return Purchase
}
