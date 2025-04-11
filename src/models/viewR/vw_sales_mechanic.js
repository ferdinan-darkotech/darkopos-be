"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_sales_mechanic", {
    storeCode: { type: DataTypes.STRING },
    storeName: { type: DataTypes.STRING },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    transNo: { type: DataTypes.STRING },
    woId: { type: DataTypes.INTEGER },
    woReference: { type: DataTypes.STRING },
    // memberCode: { type: DataTypes.INTEGER },
    transDate: { type: DataTypes.DATE },
    policeNoId: { type: DataTypes.INTEGER },
    bundlingId: { type: DataTypes.INTEGER },
    employeeCode: { type: DataTypes.STRING },
    employeeName: { type: DataTypes.STRING },
    qty: { type: DataTypes.NUMERIC },
    sellPrice: { type: DataTypes.NUMERIC },
    sellingPrice: { type: DataTypes.NUMERIC },
    discount: { type: DataTypes.NUMERIC },
    disc1: { type: DataTypes.NUMERIC },
    disc2: { type: DataTypes.NUMERIC },
    disc3: { type: DataTypes.NUMERIC },
    DPP: { type: DataTypes.NUMERIC },
    PPN: { type: DataTypes.NUMERIC },
    typeCode: { type: DataTypes.STRING }
  }, { tableName: 'vw_sales_mechanic' })
}