"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_wo_check", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    woId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    checkId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    memo: {
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
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
  }, {
      tableName: 'tbl_wo_check'
    })

  return Table
}