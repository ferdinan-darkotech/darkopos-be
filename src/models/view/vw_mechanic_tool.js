"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwMechanicTool = sequelize.define("vw_mechanic_tool", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    employeecode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employeename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storecode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storename: {
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

    // [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
    toolcode: {
      type: DataTypes.STRING,
      allowNull: true
    },

    qty_delete: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {freezeTableName: true}, {
    tableName: 'vw_mechanic_tool'
  })

  return vwMechanicTool
}