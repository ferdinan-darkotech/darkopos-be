"use strict";

module.exports = function(sequelize, DataTypes) {
  let Area = sequelize.define("tbl_area", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    areacode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: 'city_unique_key',
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
      }
    },
    areaname: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sync_data: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    tableName: 'tbl_area'
  })
  return Area
}