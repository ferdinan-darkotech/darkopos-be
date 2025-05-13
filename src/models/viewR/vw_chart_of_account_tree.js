"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var COA = sequelize.define("vw_chart_of_account_tree", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    coacode: { type: DataTypes.STRING },
    coaname: { type: DataTypes.STRING },
    paths: { type: DataTypes.STRING },
    level: { type: DataTypes.INTEGER },
    levelpath: { type: DataTypes.STRING },
    coadesc: { type: DataTypes.STRING },
    coatypeid: { type: DataTypes.INTEGER },
    coatypecode: { type: DataTypes.STRING },
    coatypename: { type: DataTypes.STRING },
    createdby: { type: DataTypes.STRING },
    createdat: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('createdat') ? moment(this.getDataValue('createdat')).format('YYYY-MM-DD hh:mm:ss') : null
      }
    },
    updatedby: { type: DataTypes.STRING },
    updatedat: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('updatedat') ? moment(this.getDataValue('updatedat')).format('YYYY-MM-DD hh:mm:ss') : null
      }
    },
    active: { type: DataTypes.BOOLEAN },
    sortingindex: { type: DataTypes.INTEGER },
    coaparentid: { type: DataTypes.INTEGER },
    coaparentcode: { type: DataTypes.STRING }
  }, {
      tableName: 'vw_chart_of_account_tree'
    })
  return COA
}