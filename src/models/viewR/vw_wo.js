// [NEW]: FERDINAN - 2025-03-03
"use strict"
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const viewwo = sequelize.define("vw_wo", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    woNo: { type: DataTypes.STRING },
    storeId: { type: DataTypes.INTEGER },
    memberId: { type: DataTypes.INTEGER },
    policeNoId: { type: DataTypes.INTEGER },
    woDate: {
          type: DataTypes.STRING,
          get() {
            return this.getDataValue('woDate') ? moment(this.getDataValue('woDate')).format('YYYY-MM-DD') : null
          }
    },
    transDate: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('transDate') ? moment(this.getDataValue('transDate')).format('YYYY-MM-DD') : null
      }
    },
    timeIn: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('timeIn') ? moment(this.getDataValue('timeIn')).format('YYYY-MM-DD') : null
      }
    },
    takeAway: {
        type: DataTypes.BOOLEAN,
        get() {
          return +this.getDataValue('takeAway') === 0 ? false : true;
        }
    },
    storeCode: { type: DataTypes.STRING },
    storeName: { type: DataTypes.STRING },
    memberCode: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    policeNo: { type: DataTypes.STRING },
    merk: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    chassisNo: { type: DataTypes.STRING },
    machineNo: { type: DataTypes.STRING },
    year: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE },
    deletedBy: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE },

    memberPendingPayment: { type: DataTypes.INTEGER },
    address01: { type: DataTypes.STRING },
    address02: { type: DataTypes.STRING },
    taxId: { type: DataTypes.STRING },
    memberSellPrice: { type: DataTypes.STRING },
    memberTypeId: { type: DataTypes.INTEGER },
    memberTypeName: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    showAsDiscount: { type: DataTypes.TINYINT },
    cashback: { type: DataTypes.INTEGER },
    
    employeeCode: { type: DataTypes.STRING },
    employeeName: { type: DataTypes.STRING },
    vehicle_km: { type: DataTypes.INTEGER },
    gasoline_percent: { type: DataTypes.INTEGER },
    bundle_promo: { type: DataTypes.JSON }, 
    cashier_trans: { type: DataTypes.JSON },
    service_detail: { type: DataTypes.JSON },
    memberUnit: { type: DataTypes.JSON },

    gender: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    current_duplicate: { type: DataTypes.INTEGER },
    total_duplicate: { type: DataTypes.INTEGER },
    drivername: { type: DataTypes.STRING },
    noreference: { type: DataTypes.STRING },

    wo_status: { type: DataTypes.STRING },
    headerid: { type: DataTypes.STRING },
    companylogo: { type: DataTypes.STRING },
    memberaddress01: { type: DataTypes.STRING },
    memberaddress02: { type: DataTypes.STRING },
    membermobilenumber: { type: DataTypes.STRING },
    memberphonenumber: { type: DataTypes.STRING },

    // [STATUS VEHICLE]: FERDINAN - 2025/07/01
    statusvehicle: { type: DataTypes.STRING },
  }, { tableName: 'vw_wo', freezeTableName: true, timestamps: false  })
  return viewwo
}



