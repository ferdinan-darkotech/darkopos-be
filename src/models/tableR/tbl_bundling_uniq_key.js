"use strict";

module.exports = function(sequelize, DataTypes) {
  let Area = sequelize.define("tbl_bundling_uniq_key", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    promo_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uniq_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    tableName: 'tbl_bundling_uniq_key',
    freezeTableName: true,
    timestamps: false
  })
  return Area
}