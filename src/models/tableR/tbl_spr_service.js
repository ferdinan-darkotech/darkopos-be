"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbl_spr_service", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    reg_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cost: {
      type: DataTypes.NUMERIC(19, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    service_cost: {
      type: DataTypes.NUMERIC(19, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    reminder_in_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    reminder_in_km: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    sync_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    sync_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, { tableName: 'tbl_spr_service', freezeTableName: true, timestamps: false })
}
