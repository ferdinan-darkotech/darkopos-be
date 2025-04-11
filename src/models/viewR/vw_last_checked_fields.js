"use strict";

module.exports = function (sequelize, DataTypes) {
  var lastCheckedFields = sequelize.define("vw_last_checked_fields", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    policenoid: { type: DataTypes.INTEGER },
    policeno: { type: DataTypes.STRING },
    fieldid: { type: DataTypes.INTEGER },
    fieldname: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
    condition: { type: DataTypes.INTEGER },
    memo: { type: DataTypes.STRING },
    lastchecked: { type: DataTypes.DATE },
    lastcheckedkm: { type: DataTypes.DECIMAL(19,2) },
  }, { tableName: 'vw_last_checked_fields' })

  lastCheckedFields.removeAttribute('id')
  return lastCheckedFields
}
