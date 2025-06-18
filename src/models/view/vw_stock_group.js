// [MASTER PRODUCT GROUP]: FERDINAN - 16/06/2025
"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwStockGroup = sequelize.define("vw_stock_group", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    groupCode: {
      type: DataTypes.STRING(20)
    },
    groupName: {
      type: DataTypes.STRING(50),
    },
    groupImage: {
      type: DataTypes.STRING(50),
    },
    groupParentId: {
      type: DataTypes.INTEGER,
    },
    groupParentCode: {
      type: DataTypes.STRING(20)
    },
    groupParentName: {
      type: DataTypes.STRING(50)
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    max_disc: {type: DataTypes.NUMERIC(16,5)},
    createdAt: { type: DataTypes.DATE },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: { type: DataTypes.DATE }
  }, {
      tableName: 'vw_stock_group'      
    }, {
      uniqueKeys: {
        group_unique_key: {
          fields: ['groupCode']
        }
      }
    })
  
  return vwStockGroup
}