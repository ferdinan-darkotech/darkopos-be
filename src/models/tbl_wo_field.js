"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_wo_field", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fieldName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    sortingIndex: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fieldParentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    typefields: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    typevalue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    usageperiod: { type: DataTypes.INTEGER, allowNull: true },
    usagemileage: { type: DataTypes.DECIMAL(19,2), allowNull: true },
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
      tableName: 'tbl_wo_field'
    })

  return Table
}