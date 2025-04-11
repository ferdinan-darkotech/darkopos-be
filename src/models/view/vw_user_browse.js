"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("vw_user_browse", {
    'userId': {
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
      type: DataTypes.BOOLEAN
    },
    isEmployee: {
      type: DataTypes.BOOLEAN
    },
    userRole: {
      type: DataTypes.STRING(20)
    },
    hash: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(128),
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
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
    tableName: 'vw_user_browse'
  })

  return User
}
