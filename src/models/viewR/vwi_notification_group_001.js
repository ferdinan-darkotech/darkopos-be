"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwiNotificationGroup001 = sequelize.define("vwi_notification_group_001", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    timerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timerName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    timerPattern: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
    }
  }, {
    freezeTableName: true,
    timestamps: false
  }, {
    tableName: 'vwi_notification_group_001'
  })

  return vwiNotificationGroup001
}