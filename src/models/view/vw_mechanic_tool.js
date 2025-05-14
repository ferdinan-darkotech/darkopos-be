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
    }
  }, {freezeTableName: true}, {
    tableName: 'vw_mechanic_tool'
  })

  return vwMechanicTool
}