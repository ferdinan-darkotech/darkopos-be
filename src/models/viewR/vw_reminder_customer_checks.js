"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var ReminderChecks = sequelize.define("vw_reminder_customer_checks", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    lastid: { type: DataTypes.INTEGER },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    policenoid: { type: DataTypes.INTEGER },
    policeno: { type: DataTypes.STRING },
    checktype: { type: DataTypes.STRING },
    checkname: { type: DataTypes.STRING },
    unityear: { type: DataTypes.INTEGER },
    lastcheckkm: { type: DataTypes.INTEGER },
    last_timein: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('last_timein') ? moment(this.getDataValue('last_timein')).format('YYYY-MM-DD') : null
      }
    },
    usagemileage: { type: DataTypes.DECIMAL(19,2) },
    usageperiod: { type: DataTypes.INTEGER },
    diffdaymileage: { type: DataTypes.INTEGER },
    nextcheckmileage: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('nextcheckmileage') ? moment(this.getDataValue('nextcheckmileage')).format('YYYY-MM-DD') : null
      }
    },
    diffdayperiod: { type: DataTypes.INTEGER },
    nextcheckperiod: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('nextcheckperiod') ? moment(this.getDataValue('nextcheckperiod')).format('YYYY-MM-DD') : null
      }
    },
    actualnextcheck: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('actualnextcheck') ? moment(this.getDataValue('actualnextcheck')).format('YYYY-MM-DD') : null
      }
    }
  }, { tableName: 'vw_reminder_customer_checks' })

  ReminderChecks.removeAttribute('id')
  return ReminderChecks
}
