"use strict";

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("tbl_user", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_]{6,15}$/i
      }
    },
    userName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    fullName: {
      type: DataTypes.STRING(50)
    },
    active: {
      type: DataTypes.TINYINT,
      defaultValue: true
    },
    isEmployee: {
      type: DataTypes.TINYINT
    },
    hash: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    totp: {
      type: DataTypes.STRING(30),
    },
    resetPassword: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
  }, {
      tableName: 'tbl_user'
    })

  return User
}
