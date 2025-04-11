"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var ReportTransAllGroup = sequelize.define("vw_report_trans_all_group", {
    storeId: { type: DataTypes.INTEGER },
    storeCode: { type: DataTypes.STRING },
    storeName: { type: DataTypes.STRING },
    cashierTransId: { type: DataTypes.INTEGER },
    transNo: { type: DataTypes.STRING },
    transDate: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
      }
    },
    woReference: { type: DataTypes.STRING },
    qtyUnit: { type: DataTypes.NUMERIC },
    qtyProduct: { type: DataTypes.NUMERIC },
    qtyService: { type: DataTypes.NUMERIC },
    counter: { type: DataTypes.NUMERIC },
    product: { type: DataTypes.NUMERIC },
    service: { type: DataTypes.NUMERIC },
    discount: { type: DataTypes.NUMERIC },
    dpp: { type: DataTypes.NUMERIC },
    status: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    policeNo: { type: DataTypes.STRING }
  }, { tableName: 'vw_report_trans_all_group' })
  return ReportTransAllGroup
}
