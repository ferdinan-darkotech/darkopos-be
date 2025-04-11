"use strict";

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("vw_customer_coupon", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    coupon_code: { type: DataTypes.STRING },
    ho_id: { type: DataTypes.INTEGER },
    ho_code: { type: DataTypes.STRING },
    ho_name: { type: DataTypes.STRING },
    member_id: { type: DataTypes.INTEGER },
    member_code: { type: DataTypes.STRING },
    member_name: { type: DataTypes.STRING },
    verification_wa_id: { type: DataTypes.STRING },
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
    point_earned: { type: DataTypes.NUMERIC(16,0) },
    point_used: { type: DataTypes.NUMERIC(16,0) },
    created_by: { type: DataTypes.STRING(30) },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING(30) },
    updated_at: { type: DataTypes.DATE }
  }, {
    tableName: 'vw_customer_coupon',
    freezeTableName: true,
    timestamps: false
  })
}