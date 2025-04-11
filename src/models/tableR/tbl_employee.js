"use strict";

module.exports = function (sequelize, DataTypes) {
  var Employee = sequelize.define("tbl_employee", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,10}$/i
      }
    },
    idNo: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.STRING(10),
      allowNull: true,
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
    address01: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    address02: {
      type: DataTypes.STRING(30)
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    kelid: { type: DataTypes.INTEGER(10), allowNull: false },
    mobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(30),
      unique: true,
      validate: {
        isEmail: true
      }
    },
    storeid: {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
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
      allowNull: true
    }
  }, {
      tableName: 'tbl_employee',
      paranoid: true
    })

  return Employee
}