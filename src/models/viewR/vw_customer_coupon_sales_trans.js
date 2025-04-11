"use strict";

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("vw_customer_coupon_sales_trans", {
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
    point_receive: { type: DataTypes.NUMERIC(16,0) }
  }, {
    tableName: 'vw_customer_coupon_sales_trans',
    freezeTableName: true,
    timestamps: false
  })
}