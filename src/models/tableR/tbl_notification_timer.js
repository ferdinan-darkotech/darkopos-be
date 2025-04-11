"use strict";

module.exports = function (sequelize, DataTypes) {
  var NotificationTimer = sequelize.define("tbl_notification_timer", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: 'code_unique_key',
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    pattern: {
      type: DataTypes.STRING(20),
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
      tableName: 'tbl_notification_timer'
    }, {
      uniqueKeys: {
        code_unique_key: {
          fields: ['code']
        }
      }
    })

  return NotificationTimer
}