"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  const ApprovalSP = sequelize.define("vw_approval_customer_data", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    appvid: { type: DataTypes.INTEGER },
		appvno: { type: DataTypes.STRING },
    specuser: { type: DataTypes.JSON },
		membercode: { type: DataTypes.STRING },
		membername: { type: DataTypes.STRING },
		membergroupid: { type: DataTypes.INTEGER },
		membertypeid: { type: DataTypes.INTEGER },
		membercategoryid: { type: DataTypes.INTEGER },
		membergroupcode: { type: DataTypes.STRING },
		membergroupname: { type: DataTypes.STRING },
		membertypecode: { type: DataTypes.STRING },
		membertypename: { type: DataTypes.STRING },
		membercategorycode: { type: DataTypes.STRING },
		membercategoryname: { type: DataTypes.STRING },
		idtype: { type: DataTypes.STRING },
		idno: { type: DataTypes.STRING },
		address01: { type: DataTypes.STRING },
		address02: { type: DataTypes.STRING },
		cityid: { type: DataTypes.INTEGER },
		state: { type: DataTypes.STRING },
		zipcode: { type: DataTypes.STRING },
		phonenumber: { type: DataTypes.STRING },
		mobilenumber: { type: DataTypes.STRING },
		email: { type: DataTypes.STRING },
		birthdate: { type: DataTypes.DATE },
		gender: { type: DataTypes.STRING },
		taxid: { type: DataTypes.STRING },
		cashback: { type: DataTypes.INTEGER },
		validitydate: { type: DataTypes.STRING },
		mobileactivate: { type: DataTypes.STRING },
		oldmembercode: { type: DataTypes.STRING },
	  reqat: { type: DataTypes.DATE, get() { return this.getDataValue('reqat') ? moment(this.getDataValue('reqat')).format('YYYY-MM-DD hh:mm:ss') : null }  },
	  reqby: { type: DataTypes.STRING },
    reqmemo: { type: DataTypes.STRING },
    appvstatus: { type: DataTypes.STRING },
	  appvby: { type: DataTypes.STRING },
	  appvat: { type: DataTypes.DATE, get() { return this.getDataValue('appvat') ? moment(this.getDataValue('appvat')).format('YYYY-MM-DD hh:mm:ss') : null } },
	  appvmemo: { type: DataTypes.STRING }
  }, { tableName: 'vw_approval_customer_data', freezeTableName: true, timestamps: false })

  ApprovalSP.removeAttribute('id');
  return ApprovalSP
}