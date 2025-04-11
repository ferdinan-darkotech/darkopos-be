"use strict";

module.exports = function (sequelize, DataTypes) {
  var NotificationTemplate = sequelize.define("tbl_notification_template", {
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
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(2000),
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
      tableName: 'tbl_notification_template'
    }, {
      uniqueKeys: {
        code_unique_key: {
          fields: ['code']
        }
      }
    })

  return NotificationTemplate
}