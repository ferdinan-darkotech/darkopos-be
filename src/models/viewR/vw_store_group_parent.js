"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_store_group_parent", {
    storeid: { type: DataTypes.INTEGER, primaryKey: true },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    parent_settingvalue: { type: DataTypes.JSON },
    settingvalue: { type: DataTypes.JSON }
  }, { tableName: 'vw_store_group_parent', freezeTableName: true })
}