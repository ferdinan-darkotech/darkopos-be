"use strict";

module.exports = function (sequelize, DataTypes) {
    var AdjustDetail = sequelize.define("tbl_adjust_detail", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        transNo: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        transType: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productCode: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        productName: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        adjInQty: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        adjOutQty: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sellingPrice: {
            type: DataTypes.DECIMAL(19,2),
            allowNull: false
        },
        closed: {
            type: DataTypes.STRING(1),
            allowNull: false
        },
        recapDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        refno: {
            type: DataTypes.STRING,
            allowNull: true
        },
	    taxtype: {
            type: DataTypes.STRING,
            allowNull: true
        },
	    taxval: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
	    discp01: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
	    discp02: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
	    discp03: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
	    discp04: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
	    discp05: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
	    discnominal: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
	    dpp: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
	    ppn: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
	    netto: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
	    rounding_netto: {
            type: DataTypes.NUMERIC(16,2),
            allowNull: true
        },
        updateStock: { type: DataTypes.BOOLEAN, allowNull: false },
        createdBy: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedBy: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^[a-z0-9\_\-]{3,30}$/i
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'tbl_adjust_detail'
    })

    return AdjustDetail
}
