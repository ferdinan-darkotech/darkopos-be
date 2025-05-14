"use strict";

module.exports = function (sequelize, DataTypes) {
  var mechanictoollog = sequelize.define("tbl_mechanic_tool_log", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    employeecode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storecode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toolname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    noreference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    referencedate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    mechanictoolid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deletedat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedby: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
      tableName: 'tbl_mechanic_tool_log',
      paranoid: true
    })

  return mechanictoollog
}