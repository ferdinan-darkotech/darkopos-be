"use strict";

//add another fields
module.exports = function (sequelize, DataTypes) {
  var reportIntransit = sequelize.define("vw_report_in_transit", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    tax: { type: DataTypes.STRING },
    transdate: { type: DataTypes.DATEONLY },
    receivedate: { type: DataTypes.DATEONLY },
    duedate: { type: DataTypes.DATEONLY },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    qty: { type: DataTypes.NUMERIC(19, 2) },
    price: { type: DataTypes.NUMERIC(19, 2) },
    discp1: { type: DataTypes.NUMERIC(19, 2) },
    discp2: { type: DataTypes.NUMERIC(19, 2) },
    discp3: { type: DataTypes.NUMERIC(19, 2) },
    discp4: { type: DataTypes.NUMERIC(19, 2) },
    discp5: { type: DataTypes.NUMERIC(19, 2) },
    discnominal: { type: DataTypes.NUMERIC(19, 2) },
    discitem: { type: DataTypes.NUMERIC(19, 2) },
    rounding_dpp: { type: DataTypes.NUMERIC(19, 2) },
    rounding_ppn: { type: DataTypes.NUMERIC(19, 2) },
    rounding_netto: { type: DataTypes.NUMERIC(19, 2) },
    dpp: { type: DataTypes.NUMERIC(19, 2) },
    ppn: { type: DataTypes.NUMERIC(19, 2) },
    netto: { type: DataTypes.NUMERIC(19, 2) }
  }, { tableName: 'vw_report_in_transit', timestamps: false, freezeTableName: true })

  reportIntransit.removeAttribute()
  return reportIntransit
}
