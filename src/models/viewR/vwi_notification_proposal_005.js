"use strict";
import moment from 'moment'

module.exports = function(sequelize, DataTypes) {
  var vwiNotificationProposal005 = sequelize.define("vwi_notification_proposal_005", {
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
      allowNull: false,
      get() {
        return moment(this.getDataValue('dataDate')).format('YYYY-MM-DD');
      }
    },
    dataInfo: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    content: {
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
    tableName: 'vwi_notification_proposal_005'
  })

  return vwiNotificationProposal005
}