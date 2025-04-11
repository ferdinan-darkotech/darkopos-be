"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var CancelQueue = sequelize.define("vw_cancel_queue_sales", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    headerid: { type: DataTypes.STRING },
    queuenumber: { type: DataTypes.INTEGER },
    woid: { type: DataTypes.INTEGER },
    wono: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    cscode: { type: DataTypes.STRING },
    employeeid: { type: DataTypes.INTEGER },
    employeecode: { type: DataTypes.STRING },
    employeename: { type: DataTypes.STRING },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    policeno: { type: DataTypes.STRING },
    memo: { type: DataTypes.STRING },
    current_duplicate: { type: DataTypes.INTEGER },
    total_duplicate: { type: DataTypes.INTEGER },
    timein: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('timein') ? moment(this.getDataValue('timein')).format('DD MMMM YYYY, HH:mm:ss') : null
      }
    },
    cancelat: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('cancelat') ? moment(this.getDataValue('cancelat')).format('DD MMMM YYYY, HH:mm:ss') : null
      }
    }
  }, { tableName: 'vw_cancel_queue_sales', freezeTableName: true, timestamps: false })

  CancelQueue.removeAttribute('id')
  return CancelQueue
}
