"use strict";

module.exports = function (sequelize, DataTypes) {
  var Target = sequelize.define("tbl_target", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    closing: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(140),
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
    },
    deletedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
  }, {
      tableName: 'tbl_target',
      paranoid: true,
      timestamp: true
    })
  return Target
}