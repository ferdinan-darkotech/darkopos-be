"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var Transfer = sequelize.define("vw_transfer_in", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    storeName: { type: DataTypes.STRING, allowNull: true },
    storeCode: { type: DataTypes.STRING, allowNull: true },
    storeIdSender: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    storeNameSender: { type: DataTypes.STRING, allowNull: true },
    transNo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    referenceDate: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return this.getDataValue('referenceDate') ? moment(this.getDataValue('referenceDate')).format('YYYY-MM-DD') : null
      }
    },
    referenceTrans: { type: DataTypes.STRING, allowNull: true },
    transType: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    employeeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    employeeName: { type: DataTypes.STRING, allowNull: true },
    carNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    active: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    transDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return this.getDataValue('transDate') ? moment(this.getDataValue('transDate')).format('YYYY-MM-DD') : null
      }
    },
    totalPackage: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: {
      type: DataTypes.DATE, allowNull: true,
      get() {
        return this.getDataValue('createdat') ? moment(this.getDataValue('createdat')).format('YYYY-MM-DD hh:mm:ss') : null
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return this.getDataValue('updatedat') ? moment(this.getDataValue('updatedat')).format('YYYY-MM-DD hh:mm:ss') : null
      }
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
    tableName: 'vw_transfer_in'
  })
  return Transfer
}
