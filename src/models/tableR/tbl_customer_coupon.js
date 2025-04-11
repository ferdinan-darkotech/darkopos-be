"use strict";

module.exports = function(sequelize, DataTypes) {
  let Area = sequelize.define("tbl_customer_coupon", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    curr_coupon_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ho_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    policeno_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    point_earned: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: true,
      defaultValue: 0 
    },
    point_used: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: true,
      defaultValue: 0 
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
    tableName: 'tbl_customer_coupon',
    freezeTableName: true,
    timestamps: false
  })
  return Area
}