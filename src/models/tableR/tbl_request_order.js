"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbl_request_order", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: { type: DataTypes.INTEGER, allowNull: false },
    storeidreceiver: { type: DataTypes.INTEGER, allowNull: false },
    transno: { type: DataTypes.INTEGER, allowNull: false },
    transdate: { type: DataTypes.DATE, allowNull: false },
    categorycode: { type: DataTypes.STRING, allowNull: false },
    transmemo: { type: DataTypes.STRING, allowNull: true },
    // closestatus: { type: DataTypes.STRING, allowNull: false },
    // closeby: { type: DataTypes.STRING, allowNull: true },
    // closedate: { type: DataTypes.DATE, allowNull: true },
    // closememo: { type: DataTypes.STRING, allowNull: true },
    createdby: { type: DataTypes.STRING, allowNull: true },
    updatedby: { type: DataTypes.STRING, allowNull: true },
    createdat: { type: DataTypes.DATE, allowNull: false },
    updatedat: { type: DataTypes.DATE, allowNull: true }
  }, {
      tableName: 'tbl_request_order'
    })
}