"use strict";

module.exports = function (sequelize, DataTypes) {
  var NotificationLog = sequelize.define("tbl_notification_log", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dataPush: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    dataLog: {
      type: DataTypes.STRING(3000),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{2,30}$/i
      }
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{2,30}$/i
      }
    }
  }, {
    tableName: 'tbl_notification_log'
  })

  return NotificationLog
}