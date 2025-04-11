"use strict"
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  let PosQueue = sequelize.define("vw_queue_pos", {
    id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	queuenumber: { type: DataTypes.STRING },
	headerid: { type: DataTypes.STRING },
	storeId: { type: DataTypes.INTEGER },
	memberCode: { type: DataTypes.STRING },
	memberName: { type: DataTypes.STRING },
	memberPendingPayment: { type: DataTypes.STRING },
	address01: { type: DataTypes.STRING },
	address02: { type: DataTypes.STRING },
	taxId: { type: DataTypes.STRING },
	memberSellPrice: { type: DataTypes.STRING },
	memberTypeId: { type: DataTypes.INTEGER },
	memberTypeName: { type: DataTypes.STRING },
	phone: { type: DataTypes.STRING },
	showAsDiscount: { type: DataTypes.TINYINT },
	cashback: { type: DataTypes.INTEGER },
	gender: { type: DataTypes.STRING },
	employeeId: { type: DataTypes.STRING },
	employeeCode: { type: DataTypes.STRING },
	employeeName: { type: DataTypes.STRING },
	woNumber: { type: DataTypes.STRING },
	woId: { type: DataTypes.INTEGER },
	woNo: { type: DataTypes.STRING },
	policeNo: { type: DataTypes.STRING },
	timeIn: {
		type: DataTypes.STRING,
		get() {
			return moment(this.getDataValue('timein')).format('YYYY-MM-DD hh:mm:ss');
		}
	},
	vehicle_km: { type: DataTypes.DECIMAL(16,5) },
	gasoline_percent: { type: DataTypes.DECIMAL(10,2) },
	bundle_promo: { type: DataTypes.JSON },
	cashier_trans: { type: DataTypes.JSON },
	service_detail: { type: DataTypes.JSON },
	memberUnit: { type: DataTypes.JSON },
	customer_confirm: { type: DataTypes.STRING },
	mechanics_confirm: { type: DataTypes.JSON },
	voucherPayment: { type: DataTypes.JSON },
	createdBy: { type: DataTypes.STRING },
	updatedBy: { type: DataTypes.STRING },
	createdAt: { type: DataTypes.STRING },
	updatedAt: { type: DataTypes.STRING },

	request_stock_out: { type: DataTypes.JSON } // [NEW]: FERDINAN - 2025-03-07
  }, {
      tableName: 'vw_queue_pos',
      freezeTableName: true
		})
  return PosQueue
}
