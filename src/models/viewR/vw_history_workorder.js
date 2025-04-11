"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var HistoryWO = sequelize.define("vw_history_workorder", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    woid: { type: DataTypes.INTEGER },
    wono: { type: DataTypes.STRING },
    salesid: { type: DataTypes.INTEGER },
    salesno: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    cscode: { type: DataTypes.STRING },
    csname: { type: DataTypes.STRING },
    cashiercode: { type: DataTypes.STRING },
    cashiername: { type: DataTypes.STRING },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    policenoid: { type: DataTypes.INTEGER },
    policeno: { type: DataTypes.STRING },
    timein: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('timein') ? moment(this.getDataValue('timein')).format('DD MMMM YYYY, HH:mm:ss') : null
      }
    },
    timeout: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('timeout') ? moment(this.getDataValue('timeout')).format('DD MMMM YYYY, HH:mm:ss') : null
      }
    }
  }, { tableName: 'vw_history_workorder' })

  HistoryWO.removeAttribute('id')
  return HistoryWO
}
