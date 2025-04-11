"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const vwWilayah = sequelize.define("mv_wilayah", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    prov_id: { type: DataTypes.INTEGER },
    prov_kode: { type: DataTypes.STRING },
    prov_nama: { type: DataTypes.STRING },
    kab_id: { type: DataTypes.INTEGER },
    kab_nama: { type: DataTypes.STRING },
    ibukota: { type: DataTypes.STRING },
    kec_id: { type: DataTypes.INTEGER },
    kec_nama: { type: DataTypes.STRING },
    kel_id: { type: DataTypes.INTEGER },
    kel_nama: { type: DataTypes.STRING },
    pos_kode: { type: DataTypes.STRING }
  }, { tableName: 'mv_wilayah', freezeTableName: true, timestamps: false })
  vwWilayah.removeAttribute('id')
  return vwWilayah
}











