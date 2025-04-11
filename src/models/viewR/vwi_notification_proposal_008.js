"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwiNotificationProposal008 = sequelize.define("vwi_notification_proposal_008", {
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
    timerPattern: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  }, {
    tableName: 'vwi_notification_proposal_008'
  })

  return vwiNotificationProposal008
}