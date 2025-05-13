"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var VoidSls = sequelize.define("vw_approval_void_sales_trans", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    appvid: { type: DataTypes.STRING },
    appvno: { type: DataTypes.STRING },
    specuser: { type: DataTypes.JSON },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdate: {
      type: DataTypes.DATEONLY,
      get() {
        return this.getDataValue('transdate') ? moment(this.getDataValue('transdate')).format('YYYY-MM-DD') : null
      }
    },
    employeecode: { type: DataTypes.STRING },
    employeename: { type: DataTypes.STRING },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    policeno: { type: DataTypes.STRING },
    wono: { type: DataTypes.STRING },
    total_netto: { type: DataTypes.NUMERIC },
    total_dpp: { type: DataTypes.NUMERIC },
    total_ppn: { type: DataTypes.NUMERIC },
    appvgroupid: { type: DataTypes.STRING },
    appvtype: { type: DataTypes.STRING },
    appvname: { type: DataTypes.STRING },
    reqmemo: { type: DataTypes.STRING },
    reqby: { type: DataTypes.STRING },
    reqat: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('reqat') ? moment(this.getDataValue('reqat')).format('YYYY-MM-DD hh:mm:ss') : null
      }
    },
    appvby: { type: DataTypes.STRING },
    appvat: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('reqat') ? moment(this.getDataValue('reqat')).format('YYYY-MM-DD hh:mm:ss') : null
      }
    },
    appvstatus: { type: DataTypes.STRING },
    appvmemo: { type: DataTypes.STRING },
    appvlvl: { type: DataTypes.STRING },
    appvrules: { type: DataTypes.STRING }
  }, {
      tableName: 'vw_approval_void_sales_trans',
      timestamps: false,
      freezeTableName: true
    })
  
  VoidSls.removeAttribute('id')
  return VoidSls
}