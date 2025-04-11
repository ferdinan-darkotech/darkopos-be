"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var ReminderCust = sequelize.define("vw_reminder_customer_groups", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    lastid: { type: DataTypes.INTEGER },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    policenoid: { type: DataTypes.INTEGER },
    policeno: { type: DataTypes.STRING },
    unityear: { type: DataTypes.INTEGER },
    phonenumber: { type: DataTypes.STRING },
    mobilenumber: { type: DataTypes.STRING },
    typeunit: { type: DataTypes.STRING },
    modelunit: { type: DataTypes.STRING },
    merkunit: { type: DataTypes.STRING },
    totalcheck: { type: DataTypes.INTEGER },
    totalusage: { type: DataTypes.INTEGER }
  }, { tableName: 'vw_reminder_customer_groups' })

  ReminderCust.removeAttribute('id')
  return ReminderCust
}







