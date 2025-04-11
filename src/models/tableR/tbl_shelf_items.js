"use strict";

module.exports = function (sequelize, DataTypes) {
  const ShelfItems = sequelize.define("tbl_shelf_items", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    shelf_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, { tableName: 'tbl_shelf_items', freezeTableName: true, timestamps: false })
  
  ShelfItems.removeAttribute('id')
  
  return ShelfItems
}
