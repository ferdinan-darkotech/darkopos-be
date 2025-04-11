"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var ReportTransAll = sequelize.define("vw_report_trans_all", {
    typeCode: { type: DataTypes.STRING },
    storeId: { type: DataTypes.INTEGER },
    storeCode: { type: DataTypes.STRING },
    storeName: { type: DataTypes.STRING },
    transNo: { type: DataTypes.STRING },
    transDate: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
      }
    },
    cashierTransId: { type: DataTypes.INTEGER },
    woReference: { type: DataTypes.STRING },
    qtyProduct: { type: DataTypes.NUMERIC },
    qtyService: { type: DataTypes.NUMERIC },
    product: { type: DataTypes.NUMERIC },
    service: { type: DataTypes.NUMERIC },
    discount: { type: DataTypes.NUMERIC },
    dpp: { type: DataTypes.NUMERIC },
    netto: { type: DataTypes.NUMERIC },
    status: { type: DataTypes.STRING },
    policeNo: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING }
  }, { tableName: 'vw_report_trans_all' })
  return ReportTransAll
}
