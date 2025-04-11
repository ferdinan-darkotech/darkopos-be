"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_spk_form", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    wono: { type: DataTypes.STRING },
    timein: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('timein')).format('YYYY-MM-DD hh:mm:ss');
      }
    },
    takeaway: { type: DataTypes.STRING },
    checks: { type: DataTypes.JSON },
    fields: { type: DataTypes.JSON },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    phonenumber: { type: DataTypes.STRING },
    mobilenumber: { type: DataTypes.STRING },
    address01: { type: DataTypes.STRING },
    address02: { type: DataTypes.STRING },
    policenoid: { type: DataTypes.INTEGER },
    policeno: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    year: { type: DataTypes.INTEGER },
    model: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    createdby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    deletedat: { type: DataTypes.DATE },
    deletedby: { type: DataTypes.STRING }
  }, { tableName: 'vw_spk_form', freezeTableName: true, timestamps: false })
}