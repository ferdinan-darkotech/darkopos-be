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
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
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

    // [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
    toolcode: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
      tableName: 'tbl_mechanic_tool_log',
      paranoid: true
    })

  return mechanictoollog
}