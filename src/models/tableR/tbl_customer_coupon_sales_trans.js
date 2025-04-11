"use strict";

module.exports = function(sequelize, DataTypes) {
  let Area = sequelize.define("tbl_customer_coupon_sales_trans", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    coupon_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sales_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    point_receive: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: false
    },
    max_point: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: false
    },
    cancel_trans: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
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
    tableName: 'tbl_customer_coupon_sales_trans',
    freezeTableName: true,
    timestamps: false
  })
  return Area
}