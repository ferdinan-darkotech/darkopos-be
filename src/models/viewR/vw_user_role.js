"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var adjust = sequelize.define("vw_user_role", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true
    },
    userid: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    fullname: { type: DataTypes.STRING },
    active: { type: DataTypes.INTEGER },
    isemployee: { type: DataTypes.INTEGER },
    userrolename: { type: DataTypes.STRING },
    hash: { type: DataTypes.STRING },
    salt: { type: DataTypes.STRING },
    totp: { type: DataTypes.STRING },
    resetpassword: { type: DataTypes.STRING },
    userrole: { type: DataTypes.STRING },
    defaultrolestatus: { type: DataTypes.INTEGER },
    createdat: { type: DataTypes.DATE },
    createdby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING }
  }, {
      tableName: 'vw_user_role',
      freezeTableName: true,
      timestamps: false
    })

  return adjust
}