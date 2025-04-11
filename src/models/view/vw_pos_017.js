"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("vw_pos_017", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeId: { type: DataTypes.INTEGER },
    transNoId: { type: DataTypes.INTEGER },
    transNo: { type: DataTypes.STRING },
    technicianId: { type: DataTypes.INTEGER },
    technicianCode: { type: DataTypes.STRING },
    technicianName: { type: DataTypes.STRING },
    employeeDetailId: { type: DataTypes.INTEGER },
    employeeDetailCode: { type: DataTypes.STRING },
    employeeDetailName: { type: DataTypes.STRING },
    discItem: { type: DataTypes.NUMERIC },
    transDate: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
      }
    },
    transTime: { type: DataTypes.DATE },
    cashierTransId: { type: DataTypes.INTEGER },
    productId: { type: DataTypes.INTEGER },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    typeCode: { type: DataTypes.STRING },
    grandTotal: { type: DataTypes.NUMERIC },
    totalDiscount: { type: DataTypes.NUMERIC },
    qty: { type: DataTypes.NUMERIC },
    sellPrice: { type: DataTypes.NUMERIC },
    sellingPrice: { type: DataTypes.NUMERIC },
    total: { type: DataTypes.NUMERIC },
    grandTotal: { type: DataTypes.NUMERIC },
    discountLoyalty: { type: DataTypes.NUMERIC },
    discount: { type: DataTypes.NUMERIC },
    disc1: { type: DataTypes.NUMERIC },
    disc2: { type: DataTypes.NUMERIC },
    disc3: { type: DataTypes.NUMERIC },
    DPP: { type: DataTypes.NUMERIC },
    PPN: { type: DataTypes.NUMERIC },
    rounding: { type: DataTypes.INTEGER },
    discInvoicePercent: { type: DataTypes.NUMERIC },
    discInvoiceNominal: { type: DataTypes.NUMERIC },
    status: { type: DataTypes.STRING },
    memberCode: { type: DataTypes.STRING },
    policeNo: { type: DataTypes.STRING },
    policeNoId: { type: DataTypes.INTEGER },
    lastMeter: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }    
  }, { tableName: 'vw_pos_017' })
  return Pos
}
