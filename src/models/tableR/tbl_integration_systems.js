"use strict";

module.exports = function(sequelize, DataTypes) {
  let Area = sequelize.define("tbl_integration_systems", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value01: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    value02: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    tableName: 'tbl_integration_systems'
  })
  return Area
}