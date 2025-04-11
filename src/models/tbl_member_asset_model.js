"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_member_asset_model", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modelCode: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    modelName: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
      tableName: 'tbl_member_asset_model'
    })

  return Table
}
