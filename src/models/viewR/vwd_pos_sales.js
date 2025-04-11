"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var vwDetailPos = sequelize.define("vwd_pos_sales", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    headerid: { type: DataTypes.INTEGER, primaryKey: true },
    transno: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    woid: { type: DataTypes.INTEGER },
    woreference: { type: DataTypes.STRING },
    employeecode: { type: DataTypes.STRING },
    employeename: { type: DataTypes.STRING },
    technicianid: { type: DataTypes.INTEGER },
    techniciancode: { type: DataTypes.STRING },
    technicianname: { type: DataTypes.STRING },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    address01: { type: DataTypes.STRING },
    address02: { type: DataTypes.STRING },
    membertypeid: { type: DataTypes.INTEGER },
    membertypename: { type: DataTypes.STRING },
    membersellprice: { type: DataTypes.STRING },
    memberpendingpayment: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    mobilenumber: { type: DataTypes.STRING },
    phonenumber: { type: DataTypes.STRING },
    transdate: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('transdate')).format('YYYY-MM-DD');
      }
    },
    transtime: { type: DataTypes.DATE },
    cashiertransid: { type: DataTypes.INTEGER },
    cashiername: { type: DataTypes.STRING },
    total: { type: DataTypes.NUMERIC },
    grandtotal: { type: DataTypes.NUMERIC },
    discinvoicepercent: { type: DataTypes.NUMERIC },
    discinvoicenominal: { type: DataTypes.NUMERIC },
    creditcardno: { type: DataTypes.STRING },
    creditcardtype: { type: DataTypes.STRING },
    creditcardcharge: { type: DataTypes.INTEGER },
    totalcreditcard: { type: DataTypes.INTEGER },
    disc1: { type: DataTypes.NUMERIC },
    disc2: { type: DataTypes.NUMERIC },
    disc3: { type: DataTypes.NUMERIC },
    discountnominal: { type: DataTypes.NUMERIC },
    discountloyalty: { type: DataTypes.NUMERIC },
    sellingprice: { type: DataTypes.NUMERIC },
    sellprice: { type: DataTypes.NUMERIC },
    rounding: { type: DataTypes.INTEGER },
    dpp: { type: DataTypes.NUMERIC },
    ppn: { type: DataTypes.NUMERIC },
    netto: { type: DataTypes.NUMERIC },
    paid: { type: DataTypes.INTEGER },
    change: { type: DataTypes.INTEGER },
    createdby: { type: DataTypes.STRING },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE },
    policeno: { type: DataTypes.STRING },
    policenoid: { type: DataTypes.INTEGER },
    merk: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    year: { type: DataTypes.INTEGER },
    chassisno: { type: DataTypes.STRING },
    machineno: { type: DataTypes.STRING },
    expired: { type: DataTypes.DATE },
    lastmeter: { type: DataTypes.INTEGER },
    memo: { type: DataTypes.STRING },
    taxtype: { type: DataTypes.STRING },
    paymentvia: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING }
  }, {
      tableName: 'vwd_pos_sales'
    }, {
      freezeTableName: true
    })

  return vwDetailPos
}