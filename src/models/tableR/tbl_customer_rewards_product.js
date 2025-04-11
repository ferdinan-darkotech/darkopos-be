"use strict";

module.exports = function(sequelize, DataTypes) {
  let Area = sequelize.define("tbl_customer_rewards_product", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ho_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reward_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty_receive: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    point_needed: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'tbl_customer_rewards_product',
    freezeTableName: true,
    timestamps: false
  })
  return Area
}