"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("mv_condition_wofields", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    fieldcode: { type: DataTypes.STRING },
    fieldname: { type: DataTypes.STRING },
    pref: { type: DataTypes.STRING },
    key: { type: DataTypes.STRING },
    label: { type: DataTypes.STRING }
  }, { tableName: 'mv_condition_wofields', freezeTableName: true, timestamps: false })
}