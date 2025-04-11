"use strict";

module.exports = function (sequelize, DataTypes) {
  const Shelf = sequelize.define("tbl_shelf", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    shelf_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    store_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    row_numbers: {
      type: DataTypes.STRING,
      allowNull: false
    },
    shelf_numbers: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },

    // [NEW]: FERDINAN - 2025-03-03
    store_code: {
      type: DataTypes.STRING
    }
  }, { tableName: 'tbl_shelf', freezeTableName: true, timestamps: false })
  Shelf.removeAttribute('id')
  return Shelf
}
