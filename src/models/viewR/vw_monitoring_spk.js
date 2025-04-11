"use strict";

module.exports = function (sequelize, DataTypes) {
  const vwMonitSPK = sequelize.define("vw_monitoring_spk", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    listqueue: { type: DataTypes.JSON }
    
  }, { tableName: 'vw_monitoring_spk', freezeTableName: true, timestamps: false })
  vwMonitSPK.removeAttribute('id')
  return vwMonitSPK
}