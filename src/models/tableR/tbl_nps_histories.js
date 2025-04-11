"use strict";

module.exports = function (sequelize, DataTypes) {
  const NPS = sequelize.define("tbl_nps_histories", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    nps_id: { type: DataTypes.STRING },
    nps_group: { type: DataTypes.STRING, allowNull: true },
    nps_link: { type: DataTypes.STRING, allowNull: true },
    nps_payload: { type: DataTypes.JSON },
    nps_ref: { type: DataTypes.STRING },
    nps_store: { type: DataTypes.STRING },
    publish_at: { type: DataTypes.DATE },
    response_at: { type: DataTypes.DATE }
  }, { tableName: 'tbl_nps_histories', freezeTableName: true, timestamps: false })

  NPS.removeAttribute('id')
  return NPS
}