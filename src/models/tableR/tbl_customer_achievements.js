"use strict";

module.exports = function(sequelize, DataTypes) {
  let Area = sequelize.define("tbl_customer_achievements", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ho_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    member_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'tbl_customer_achievements',
    freezeTableName: true,
    timestamps: false
  })
  return Area
}