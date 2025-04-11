"use strict";

module.exports = function (sequelize, DataTypes) {
  var Cash = sequelize.define("tbl_cash_entry_type", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    typeCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      validate: {
        is: /^[a-z0-9-/]{3,6}$/i
      }
    },
    typeName: {
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
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_cash_entry_type'
    })

  return Cash
}