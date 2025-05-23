"use strict";

module.exports = function (sequelize, DataTypes) {
  var mechanictool = sequelize.define("tbl_mechanic_tool", {
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
    }
  }, {
      tableName: 'tbl_mechanic_tool',
      paranoid: true
    })

  return mechanictool
}