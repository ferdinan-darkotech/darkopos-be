"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwEmployeeNotUser = sequelize.define("vw_employee_not_user", {
    employeeId: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_]{6,15}$/i
      }
    },
    employeeName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[a-zA-Z0-9_ ]{3,50}$/i
      }
    },
    positionId: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_]{1,6}$/i
      }
    },
    positionName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_]{1,50}$/i
      }
    }
  }, {
    timestamps: false,
    freezeTableName: true
  }, {
    tableName: 'vw_employee_not_user'
  })

  return vwEmployeeNotUser
}