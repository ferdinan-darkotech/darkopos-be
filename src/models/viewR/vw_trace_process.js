"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_trace_process", {
    datid: { type: DataTypes.INTEGER, primaryKey: true },
    datname: { type: DataTypes.STRING },
    pid: { type: DataTypes.STRING },
    usename: { type: DataTypes.INTEGER },
    query: { type: DataTypes.STRING },
    application_name: { type: DataTypes.STRING }
  }, { tableName: 'vw_trace_process', freezeTableName: true })
}