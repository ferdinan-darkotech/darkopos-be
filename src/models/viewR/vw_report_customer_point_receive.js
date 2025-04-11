"use strict";

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("vw_report_customer_point_receive", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ho_id: { type: DataTypes.INTEGER },
    coupon_id: { type: DataTypes.INTEGER },
    coupon_code: { type: DataTypes.STRING },
    member_id: { type: DataTypes.INTEGER },
    member_code: { type: DataTypes.STRING },
    member_name: { type: DataTypes.STRING },
    member_type_id: { type: DataTypes.INTEGER },
    member_type_code: { type: DataTypes.STRING },
    member_type_name: { type: DataTypes.STRING },
    policeno_id: { type: DataTypes.INTEGER },
    policeno: { type: DataTypes.STRING },
    unit_type: { type: DataTypes.STRING },
    chassis_no: { type: DataTypes.STRING },
    unit_merk: { type: DataTypes.STRING },
    unit_model: { type: DataTypes.STRING },
    unit_year: { type: DataTypes.INTEGER },
    store_id: { type: DataTypes.INTEGER },
    store_code: { type: DataTypes.STRING },
    store_name: { type: DataTypes.STRING },
    sales_id: { type: DataTypes.INTEGER },
    sales_no: { type: DataTypes.STRING },
    sales_date: { type: DataTypes.DATE },
    cancel_trans: { type: DataTypes.BOOLEAN },
    point_receive: { type: DataTypes.NUMERIC(16,0) }
  }, {
    tableName: 'vw_report_customer_point_receive',
    freezeTableName: true,
    timestamps: false
  })
}