"use strict";

module.exports = function (sequelize, DataTypes) {
  var coa = sequelize.define("tbl_chart_of_account", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    coacode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    coaname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    coatype: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    coaparent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sortingindex: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdby: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    updatedby: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    createdat: { type: DataTypes.DATE, allowNull: false },
    updatedat: { type: DataTypes.DATE, allowNull: true }
  }, {
      tableName: 'tbl_chart_of_account'
    })
  return coa
}
