"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("table_name", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    accountCode: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        is: /^[a-z0-9-/]{3,9}$/i
      }
    },
    accountName: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    accountParentId: {
      type: DataTypes.INTEGER,
      allowNull: true
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
      tableName: 'table_name'
    })

  return Table
}