"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwiNotificationTemplate006 = sequelize.define("vwi_notification_template_006", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    timerPattern: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    groupCode: {
      type: DataTypes.STRING(6),
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  }, {
    tableName: 'vwi_notification_template_006'
  })

  return vwiNotificationTemplate006
}