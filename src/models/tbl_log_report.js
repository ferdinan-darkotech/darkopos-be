"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_log_report", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    url: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    params: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 0
    },
    duration: {
      type: DataTypes.DECIMAL(19, 6),
      allowNull: true,
      defaultValue: null
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
      tableName: 'tbl_log_report'
    })

  return Table
}