"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwMechanicToolReport = sequelize.define("vw_mechanic_tool_report", {
    employeecode: {
      type: DataTypes.STRING,
    },
    employeename: {
      type: DataTypes.STRING,
    },
    storecode: {
      type: DataTypes.STRING,
    },
    storename: {
      type: DataTypes.STRING,
    },
    toolcode: {
      type: DataTypes.STRING,
    },
    toolname: {
      type: DataTypes.STRING,
    },
    tahun: {
      type: DataTypes.STRING,
    },
    bulan: {
      type: DataTypes.STRING,
    },
    saldo_awal: {
      type: DataTypes.INTEGER,
    },
    beli: {
      type: DataTypes.INTEGER,
    },
    hapus: {
      type: DataTypes.INTEGER,
    },
    saldo_akhir: {
      type: DataTypes.INTEGER,
    },
    unit: {
      type: DataTypes.INTEGER,
    },
  }, {freezeTableName: true}, {
    tableName: 'vw_mechanic_tool_report'
  })

  return vwMechanicToolReport
}