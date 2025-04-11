"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwEmployee = sequelize.define("tbl_employee_store", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    employeeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {freezeTableName: true, timestamps: false}, {
    tableName: 'tbl_employee_store'
  })

  return vwEmployee
}