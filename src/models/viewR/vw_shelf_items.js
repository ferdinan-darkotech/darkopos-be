"use strict";

module.exports = function (sequelize, DataTypes) {
  const ShelfItems = sequelize.define("vw_shelf_items", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    reg_id: { type: DataTypes.STRING },
		store_id: { type: DataTypes.INTEGER },
		store_code: { type: DataTypes.STRING },
		store_name: { type: DataTypes.STRING },
		product_id: { type: DataTypes.INTEGER },
		product_code: { type: DataTypes.STRING },
	  product_name: { type: DataTypes.STRING },
		shelf_id: { type: DataTypes.INTEGER },
		shelf_numbers: { type: DataTypes.STRING },
		row_numbers: { type: DataTypes.STRING },
		created_by: { type: DataTypes.STRING },
		created_at: { type: DataTypes.DATE },
  }, { tableName: 'vw_shelf_items', freezeTableName: true, timestamps: false })

  ShelfItems.removeAttribute('id')
  return ShelfItems
}