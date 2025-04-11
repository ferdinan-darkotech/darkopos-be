"use strict";

module.exports = function (sequelize, DataTypes) {
  var Cashier = sequelize.define("tbl_cashier", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cashierNo: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_]{1,5}$/i
      }
    },
    cashierDesc: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_]{1,5}$/i
      }
    }
  }, {
    tableName: 'tbl_cashier'
  })

  return Cashier
}