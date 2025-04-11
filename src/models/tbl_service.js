"use strict";
//id, serviceCode, serviceName, cost, serviceCost, serviceTypeId, createdBy, updatedBy
module.exports = function (sequelize, DataTypes) {
    var Service = sequelize.define("tbl_service", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        serviceCode: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            validate: {
                is: /^[a-z0-9\_]{1,30}$/i
            }
        },
        serviceName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                is: /^[a-zA-Z0-9\_\- ]{1,50}$/
            }
        },
        serviceTypeId: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                is: /^[a-z0-9\_\-]{1,5}$/i
            }
        },
        createdBy: {
            type: DataTypes.STRING(30),
            allowNull: false,
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
            tableName: 'tbl_service'
        },
        {
            uniqueKeys: {
                service_unique_key: {
                    fields: ['serviceCode']
                }
            }
        })

    return Service
}
