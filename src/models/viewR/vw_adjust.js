"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var adjust = sequelize.define("vw_adjust", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true
    },
    storeId: { type: DataTypes.INTEGER(11) },
    storeCode: { type: DataTypes.STRING },
    storeName: { type: DataTypes.STRING },
    transNo: { type: DataTypes.STRING(25) },
    transType: { type: DataTypes.STRING(5) },
    returnstatustext: { type: DataTypes.STRING },
    transDate: { type: DataTypes.DATEONLY },
    picId: { type: DataTypes.STRING(40) },
    pic: { type: DataTypes.STRING(40) },
    reference: { type: DataTypes.STRING(40) },
    referencedate: {
      type: DataTypes.STRING,
      get() {
          return moment(this.getDataValue('referencedate')).format('YYYY-MM-DD');
      }
    },
    memo: { type: DataTypes.STRING(100) },
    status: { type: DataTypes.STRING(1) },
    supplierid: { type: DataTypes.INTEGER },
    suppliercode: { type: DataTypes.STRING },
    suppliername: { type: DataTypes.STRING },
    totalprice: { type: DataTypes.NUMERIC(19,5) },
    returnstatus: { type: DataTypes.STRING },
    returnstatustext: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING(30) },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING(30) },
    updatedAt: { type: DataTypes.DATE }
  }, {
      tableName: 'vw_adjust'
    })

  return adjust
}