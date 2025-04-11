"use strict";

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("vw_customer_rewards_product", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    achievement_id: { type: DataTypes.INTEGER },
    ho_id: { type: DataTypes.INTEGER },
    ho_code: { type: DataTypes.STRING },
    ho_name: { type: DataTypes.STRING },
    product_id: { type: DataTypes.INTEGER },
    product_code: { type: DataTypes.STRING },
    product_name: { type: DataTypes.STRING },
    qty_receive: { type: DataTypes.NUMERIC(16,0) },
    point_needed: { type: DataTypes.NUMERIC(16,0) },
    status: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.STRING(30) },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING(30) },
    updated_at: { type: DataTypes.DATE }
  }, {
    tableName: 'vw_customer_rewards_product',
    freezeTableName: true,
    timestamps: false
  })
}