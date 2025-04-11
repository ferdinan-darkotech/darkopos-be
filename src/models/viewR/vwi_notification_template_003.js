"use strict";
// a.id, a.code, a.name, a.typeId, b.code AS typeCode, b.name AS typeName,
//   a.groupId, c.code AS groupCode, c.name AS groupName, a.status, a.content, c.timerName, c.timerPattern,
//   a.createdBy, a.createdAt, a.updatedBy, a.updatedAt

module.exports = function(sequelize, DataTypes) {
  var vwiNotificationTemplate003 = sequelize.define("vwi_notification_template_003", {
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
    typeId: {
      type: DataTypes.INTEGER
    },
    typeCode: {
      type: DataTypes.STRING(6)
    },
    typeName: {
      type: DataTypes.STRING(30),
    },
    groupId: {
      type: DataTypes.INTEGER
    },
    groupCode: {
      type: DataTypes.STRING(6)
    },
    groupName: {
      type: DataTypes.STRING(30)
    },
    status: {
      type: DataTypes.STRING(1)
    },
    content: {
      type: DataTypes.STRING(2000)
    },
    timerName: {
      type: DataTypes.STRING(30)
    },
    timerPattern: {
      type: DataTypes.STRING(20)
    },
    autoApprove: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'vwi_notification_template_003'
  })

  return vwiNotificationTemplate003
}