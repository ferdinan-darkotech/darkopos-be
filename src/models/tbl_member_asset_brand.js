"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_member_asset_brand", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    brandCode: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    brandName: {
      type: DataTypes.STRING(17),
      allowNull: true,
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
      tableName: 'tbl_member_asset_brand'
    })

  return Table
}
