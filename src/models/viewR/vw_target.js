"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_target", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    rangetarget: { type: DataTypes.STRING },
    startdate: { type: DataTypes.STRING, get() { return moment(this.getDataValue('startdate')).format('YYYY-MM-DD'); } },
    enddate: { type: DataTypes.STRING, get() { return moment(this.getDataValue('enddate')).format('YYYY-MM-DD'); } },
    othertarget: { type: DataTypes.JSON },
    createdat: { type: DataTypes.DATE },
    createdby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    deletedat: { type: DataTypes.DATE },
    deletedby: { type: DataTypes.STRING }
  }, { tableName: 'vw_target', freezeTableName: true, timestamps: false })
}