"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  let MemberVerify = sequelize.define("vw_member_verify", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true
    },
    member_store_code: { type: DataTypes.STRING },
    member_store_name: { type: DataTypes.STRING },
    member_code: { type: DataTypes.STRING },
    member_name: { type: DataTypes.STRING },
    group_name: { type: DataTypes.STRING },
    app_code: { type: DataTypes.STRING },
    verify_id: { type: DataTypes.STRING },
    verify_at: { type: DataTypes.DATE, get() { return moment(this.getDataValue('verify_at')).format('DD MMM YYYY HH:mm:ss'); } }
  }, {
      tableName: 'vw_member_verify',
      timestamps: false,
      freezeTableName: true
    })
  
  MemberVerify.removeAttribute('id')
  return MemberVerify
}