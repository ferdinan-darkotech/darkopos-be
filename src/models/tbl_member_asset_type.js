"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_member_asset_type", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    typeCode: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    typeName: {
      type: DataTypes.STRING(37),
      allowNull: true,
    },
    fuel_type: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
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
    },
  }, {
      tableName: 'tbl_member_asset_type'
    })

  return Table
}
