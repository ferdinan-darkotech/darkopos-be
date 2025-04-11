"use strict"
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const MainWo = sequelize.define("vw_main_wo", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    woNo: { type: DataTypes.STRING },
    storeId: { type: DataTypes.INTEGER },
    memberId: { type: DataTypes.INTEGER },
    policeNoId: { type: DataTypes.INTEGER },
    woDate: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('woDate') ? moment(this.getDataValue('woDate')).format('YYYY-MM-DD') : null
      }
    },
    transDate: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('transDate') ? moment(this.getDataValue('transDate')).format('YYYY-MM-DD') : null
      }
    },
    timeIn: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('timeIn') ? moment(this.getDataValue('timeIn')).format('YYYY-MM-DD hh:mm:ss') : null
      }
    },
    takeAway: {
      type: DataTypes.BOOLEAN,
      get() {
        return +this.getDataValue('takeAway') === 0 ? false : true;
      }
    },
    storeCode: { type: DataTypes.STRING },
    storeName: { type: DataTypes.STRING },
    memberCode: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    policeNo: { type: DataTypes.STRING },
    merk: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    chassisNo: { type: DataTypes.STRING },
    machineNo: { type: DataTypes.STRING },
    year: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    deletedBy: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE }
  }, { tableName: 'vw_main_wo', freezeTableName: true, timestamps: false  })
  return MainWo
}



