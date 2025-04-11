"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const CashEntry = sequelize.define("vw_cash_entry", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.DATEONLY },
    transtypecode: { type: DataTypes.STRING },
    transtypename: { type: DataTypes.STRING },
    transkindcode: { type: DataTypes.STRING },
    transkindname: { type: DataTypes.STRING },
    cashierid: { type: DataTypes.STRING },
    cashiername: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN },
    createdby: { type: DataTypes.STRING },
    createdat: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('createdat') ? moment(this.getDataValue('createdat')).format('YYYY-MM-DD hh:mm:ss') : null
      }
    },
    updatedat: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('updatedat') ? moment(this.getDataValue('updatedat')).format('YYYY-MM-DD hh:mm:ss') : null
      }
    },
    updatedby: { type: DataTypes.DATE }
  }, { tableName: 'vw_cash_entry', freezeTableName: true, timestamps: false })
  return CashEntry
}
