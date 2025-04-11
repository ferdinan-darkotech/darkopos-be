"use strict";

module.exports = function (sequelize, DataTypes) {
  var VwWarranty = sequelize.define("vw_warranty_products", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    warranty_id: { type: DataTypes.STRING },
    warranty_no: { type: DataTypes.STRING },
    warranty_rules: { type: DataTypes.STRING },
    store_id: { type: DataTypes.INTEGER },
    store_code: { type: DataTypes.STRING },
    store_name: { type: DataTypes.STRING },
    sales_no: { type: DataTypes.STRING },
    sales_detail_id: { type: DataTypes.INTEGER },
    trans_date: { type: DataTypes.DATE },
    product_id: { type: DataTypes.INTEGER },
    product_code: { type: DataTypes.STRING },
    product_name: { type: DataTypes.STRING },
    product_brand: { type: DataTypes.STRING },
    member_id: { type: DataTypes.INTEGER },
    member_code: { type: DataTypes.STRING },
    member_name: { type: DataTypes.STRING },
    police_no: { type: DataTypes.STRING },
    unit_brand_name: { type: DataTypes.STRING },
    unit_type_name: { type: DataTypes.STRING },
    unit_model_name: { type: DataTypes.STRING },
    unit_category_name: { type: DataTypes.STRING },
    unit_km: { type: DataTypes.NUMERIC },
    price: { type: DataTypes.NUMERIC },
    netto: { type: DataTypes.NUMERIC },
    total_trade_in: { type: DataTypes.NUMERIC },
    address: { type: DataTypes.STRING },
    phone_number: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    town_name: { type: DataTypes.STRING },
    by_km: { type: DataTypes.NUMERIC },
    by_period: { type: DataTypes.INTEGER },
    list_payments: { type: DataTypes.JSON },
    status: { type: DataTypes.STRING },
    created_by: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING },
    updated_at: { type: DataTypes.DATE }
  }, { tableName: 'vw_warranty_products', freezeTableName: true, timestamps: false })

  VwWarranty.removeAttribute('id')
  return VwWarranty
}
