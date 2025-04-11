"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const ApprovalSP = sequelize.define("vw_approval_stock_price", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.INTEGER },
		appvno: { type: DataTypes.STRING },
    specuser: { type: DataTypes.JSON },
    productid: { type: DataTypes.INTEGER },
    productcode: { type: DataTypes.STRING },
    productname: { type: DataTypes.STRING },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
	  new_costprice: { type: DataTypes.NUMERIC },
	  new_sellprice: { type: DataTypes.NUMERIC },
	  new_sellpricepre: { type: DataTypes.NUMERIC },
	  new_distprice01: { type: DataTypes.NUMERIC },
	  new_distprice02: { type: DataTypes.NUMERIC },
	  old_costprice: { type: DataTypes.NUMERIC },
	  old_sellprice: { type: DataTypes.NUMERIC },
	  old_sellpricepre: { type: DataTypes.NUMERIC },
	  old_distprice01: { type: DataTypes.NUMERIC },
	  old_distprice02: { type: DataTypes.NUMERIC },
	  reqat: {
			type: DataTypes.DATE,
			get() {
				return this.getDataValue('reqat') ? moment(this.getDataValue('reqat')).format('YYYY-MM-DD hh:mm:ss') : null
			} 
		},
	  reqby: { type: DataTypes.STRING },
    reqmemo: { type: DataTypes.STRING },
    appvstatus: { type: DataTypes.STRING },
	  appvby: { type: DataTypes.STRING },
	  appvat: {
			type: DataTypes.DATE,
			get() {
				return this.getDataValue('appvat') ? moment(this.getDataValue('appvat')).format('YYYY-MM-DD hh:mm:ss') : null
			}
		},
	  appvmemo: { type: DataTypes.STRING }
  }, { tableName: 'vw_approval_stock_price', freezeTableName: true, timestamps: false })

  ApprovalSP.removeAttribute('id');
  return ApprovalSP
}