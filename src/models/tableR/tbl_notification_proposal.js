"use strict";

module.exports = function (sequelize, DataTypes) {
  var NotificationProposal = sequelize.define("tbl_notification_proposal", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    referenceId: {
      type: DataTypes.INTEGER
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dataContact: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    dataKey: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    dataDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dataInfo: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(1),
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
    tableName: 'tbl_notification_proposal'
  })

  return NotificationProposal
}