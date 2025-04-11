"use strict";

module.exports = function(sequelize, DataTypes) {
  var accessGranted = sequelize.define("tbl_access_granted", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    accesscode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accesskey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accessname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accessvar01: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accessvar02: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accessvar03: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        return this.getDataValue('accessvar03') ? JSON.parse(this.getDataValue('accessvar03')) : '[]';
      }
    }
  }, { tableName: 'tbl_access_granted', timestamps: false })

  return accessGranted
}