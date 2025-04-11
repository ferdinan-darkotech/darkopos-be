"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_pos_bundling", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    posId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bundlingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_pos_bundling'
    })

  return Table
}