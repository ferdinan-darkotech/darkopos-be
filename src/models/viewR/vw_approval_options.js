"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const ApprovalSP = sequelize.define("vw_approval_options", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvcode: { type: DataTypes.STRING },
    appvname: { type: DataTypes.STRING },
    reqby: { type: DataTypes.STRING },
    reqbyobj: { type: DataTypes.JSON },
    appvlvl: { type: DataTypes.INTEGER },
    reqat: { type: DataTypes.JSON }
  }, { tableName: 'vw_approval_options', freezeTableName: true, timestamps: false })

  ApprovalSP.removeAttribute('id');
  return ApprovalSP
}