"use strict";

module.exports = function(sequelize, DataTypes) {
  let DataLOVGroups = sequelize.define("tbl_data_lov_groups", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    lov_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lov_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    lov_desc: {
      type: DataTypes.STRING(70),
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
    tableName: 'tbl_data_lov_groups',
    freezeTableName: true,
    timestamps: false
  })
  DataLOVGroups.removeAttribute('id')
  return DataLOVGroups
}