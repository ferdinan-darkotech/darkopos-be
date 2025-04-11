"use strict";

module.exports = function(sequelize, DataTypes) {
  let DataLOVItems = sequelize.define("tbl_data_lov_items", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    item_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    lov_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    item_desc: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    item_value: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    tableName: 'tbl_data_lov_items',
    freezeTableName: true,
    timestamps: false
  })
  DataLOVItems.removeAttribute('id')
  return DataLOVItems
}