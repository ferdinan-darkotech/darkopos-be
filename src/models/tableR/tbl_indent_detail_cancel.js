"use strict";

module.exports = function(sequelize, DataTypes) {
  var IndentDetail = sequelize.define("tbl_indent_detail_cancel", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cancelno: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    referenceid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    productid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    returqty: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: true,
      defaultValue: 0
    },
    cancelby: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    cancelat: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tbl_indent_detail_cancel',
    timestamps: false,
    freezeTableName: true
  })
  return IndentDetail
}