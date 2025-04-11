"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_bundling", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    reg_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    ttl_reward_qty_services: {
      type: DataTypes.NUMERIC(19,0),
      allowNull: true,
    },
    ttl_reward_qty_product: {
      type: DataTypes.NUMERIC(19,0),
      allowNull: true,
    },
    ttl_rules_qty_services: {
      type: DataTypes.NUMERIC(19,0),
      allowNull: true,
    },
    ttl_rules_qty_product: {
      type: DataTypes.NUMERIC(19,0),
      allowNull: true,
    },
    ttl_reward_price_services: {
      type: DataTypes.NUMERIC(19,2),
      allowNull: true,
    },
    ttl_reward_price_product: {
      type: DataTypes.NUMERIC(19,2),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startHour: {
      type: DataTypes.TIME,
      allowNull: true
    },
    endHour: {
      type: DataTypes.TIME,
      allowNull: true
    },
    availableDate: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    availableStore: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    applyMultiple: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    generate_key_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
  }, {
      tableName: 'tbl_bundling'
    })

  return Table
}