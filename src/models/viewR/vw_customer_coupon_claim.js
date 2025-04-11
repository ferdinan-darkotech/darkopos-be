"use strict";

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("vw_customer_coupon_claim", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    coupon_id: { type: DataTypes.INTEGER },
    store_id: { type: DataTypes.INTEGER },
    store_code: { type: DataTypes.STRING },
    store_name: { type: DataTypes.STRING },
    sales_id: { type: DataTypes.INTEGER },
    sales_no: { type: DataTypes.STRING },
    sales_date: { type: DataTypes.DATE },
    cancel_trans: { type: DataTypes.BOOLEAN },
    cust_point: { type: DataTypes.NUMERIC(16,0) },
    used_point: { type: DataTypes.NUMERIC(16,0) },
    created_by: { type: DataTypes.STRING(30) },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING(30) },
    updated_at: { type: DataTypes.DATE }
  }, {
    tableName: 'vw_customer_coupon_claim',
    freezeTableName: true,
    timestamps: false
  })
}