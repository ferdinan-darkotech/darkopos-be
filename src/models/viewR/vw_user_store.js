"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var adjust = sequelize.define("vw_user_store", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true
    },
    userid: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    defaultstore: { type: DataTypes.INTEGER },
    createdat: { type: DataTypes.DATE },
    createdby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING }
  }, {
      tableName: 'vw_user_store',
      freezeTableName: true,
      timestamps: false
    })

  return adjust
}