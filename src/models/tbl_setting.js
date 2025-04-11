"use strict";

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("tbl_setting", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    settingCode: {
      type: DataTypes.STRING(60),
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    settingValue: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue('settingValue'));
      },
      set: function (value) {
        this.setDataValue('settingValue', JSON.stringify(value));
      }
    },
    createdBy: {
      type: DataTypes.STRING(15),
    },
    updatedBy: {
      type: DataTypes.STRING(15),
    }
  }, {
      tableName: 'tbl_setting'
    })

  return Pos
}
