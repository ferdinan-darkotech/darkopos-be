"use strict";
// use this view only spesific id OR rows, because it use loop inside function to replace text,

module.exports = function(sequelize, DataTypes) {
  var vwiNotificationProposal006 = sequelize.define("vwi_notification_proposal_006", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    dataContact: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    dataKey: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    dataDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dataInfo: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    content: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    contentText: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(1)
    },
    createdBy: {
      type: DataTypes.STRING(30)
    },
    updatedBy: {
      type: DataTypes.STRING(30)
    }
  }, {
    freezeTableName: true,
    timestamps: false
  }, {
    tableName: 'vwi_notification_proposal_006'
  })

  return vwiNotificationProposal006
}