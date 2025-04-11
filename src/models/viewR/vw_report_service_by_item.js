"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_report_service_by_item", {
    storeId: { type: DataTypes.INTEGER },
    transDate: { type: DataTypes.DATE, get() { return this.getDataValue('transDate') ? moment(this.getDataValue('transDate')).format('YYYY-MM-DD') : null }},
    technicianCode: { type: DataTypes.STRING },
    technicianName: { type: DataTypes.STRING },
    employeeDetailCode: { type: DataTypes.STRING },
    employeeDetailName: { type: DataTypes.STRING },
    transNo: { type: DataTypes.STRING },
    typeCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    productCode: { type: DataTypes.STRING },
    memberCode: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    policeNo: { type: DataTypes.STRING },
    qty: { type: DataTypes.DECIMAL(19,2) },
    totalDiscount: { type: DataTypes.DECIMAL(19,2) },
    sellingPrice: { type: DataTypes.DECIMAL(19,2) },
    sellPrice: { type: DataTypes.DECIMAL(19,2) },
    discountLoyalty: { type: DataTypes.DECIMAL(19,2) },
    discount: { type: DataTypes.DECIMAL(19,2) },
    disc1: { type: DataTypes.DECIMAL(19,2) },
    disc2: { type: DataTypes.DECIMAL(19,2) },
    disc3: { type: DataTypes.DECIMAL(19,2) },
    DPP: { type: DataTypes.DECIMAL(19,2) },
    PPN: { type: DataTypes.DECIMAL(19,2) },
  }, {
      tableName: 'vw_report_service_by_item',
      freezeTableName: true,
      timestamps: false
    })
}