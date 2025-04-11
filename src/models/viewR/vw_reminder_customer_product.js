"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var ReminderProduct = sequelize.define("vw_reminder_customer_product", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    lastid: { type: DataTypes.INTEGER },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    policenoid: { type: DataTypes.INTEGER },
    policeno: { type: DataTypes.STRING },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    unityear: { type: DataTypes.INTEGER },
    lastusagekm: { type: DataTypes.INTEGER },
    last_timein: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('last_timein') ? moment(this.getDataValue('last_timein')).format('YYYY-MM-DD') : null
      }
    },
    usagemileage: { type: DataTypes.DECIMAL(19,2) },
    usageperiod: { type: DataTypes.INTEGER },
    diffdaymileage: { type: DataTypes.INTEGER },
    nextusagemileage: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('nextusagemileage') ? moment(this.getDataValue('nextusagemileage')).format('YYYY-MM-DD') : null
      }
    },
    diffdayperiod: { type: DataTypes.INTEGER },
    nextusageperiod: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('nextusageperiod') ? moment(this.getDataValue('nextusageperiod')).format('YYYY-MM-DD') : null
      }
    },
    actualnextusage: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('actualnextusage') ? moment(this.getDataValue('actualnextusage')).format('YYYY-MM-DD') : null
      }
    }
  }, { tableName: 'vw_reminder_customer_product' })

  ReminderProduct.removeAttribute('id')
  return ReminderProduct
}
