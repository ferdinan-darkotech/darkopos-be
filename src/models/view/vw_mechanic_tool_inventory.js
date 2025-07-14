"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwMechanicToolInventory = sequelize.define("vw_mechanic_tool_inventory", {
    kode_barang: {
      type: DataTypes.STRING
    },
    nama_barang: {
      type: DataTypes.STRING
    },
    nama_lain: {
      type: DataTypes.STRING
    },
    input_dt: {
      type: DataTypes.DATE
    },
  }, {freezeTableName: true}, {
    tableName: 'vw_mechanic_tool_inventory'
  })

  return vwMechanicToolInventory
}