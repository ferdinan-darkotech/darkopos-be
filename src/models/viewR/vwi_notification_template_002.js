"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwiNotificationTemplate002 = sequelize.define("vwi_notification_template_002", {
    timerPattern: {
      type: DataTypes.STRING(20),
      allowNull: true,
      primaryKey: true
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
    tableName: 'vwi_notification_template_002'
  })

  return vwiNotificationTemplate002
}