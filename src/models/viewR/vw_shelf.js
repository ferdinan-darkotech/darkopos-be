"use strict";

module.exports = function (sequelize, DataTypes) {
  const Shelf = sequelize.define("vw_shelf", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
		shelf_id: { type: DataTypes.INTEGER },
		store_id: { type: DataTypes.INTEGER },
		store_code: { type: DataTypes.STRING },
		store_name: { type: DataTypes.STRING },
		shelf_numbers: { type: DataTypes.STRING },
		row_numbers: { type: DataTypes.STRING },
		status: { type: DataTypes.BOOLEAN },
		created_by: { type: DataTypes.STRING },
		created_at: { type: DataTypes.DATE },
		updated_by: { type: DataTypes.STRING },
		updated_at: { type: DataTypes.DATE }
  }, { tableName: 'vw_shelf', freezeTableName: true, timestamps: false })

  Shelf.removeAttribute('id')
  return Shelf
}