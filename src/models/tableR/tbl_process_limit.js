"use strict";

module.exports = function(sequelize, DataTypes) {
  var processLimit = sequelize.define("tbl_process_limit", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriptions: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    current_process: {
      type: DataTypes.INTEGER,
    },
    timeout: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 60
    },
  }, {
    tableName: 'tbl_process_limit',
    freezeTableName: true,
    timestamps: false
  })

  return processLimit
}