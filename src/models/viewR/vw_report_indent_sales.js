"use strict";

module.exports = function(sequelize, DataTypes) {
  var IndentSales = sequelize.define("vw_report_indent_sales", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    list_indent_no: { type: DataTypes.JSON },
    salesno: { type: DataTypes.STRING },
	  salesdate: { type: DataTypes.DATE },
	  memberid: { type: DataTypes.INTEGER },
	  membercode: { type: DataTypes.STRING },
	  membername: { type: DataTypes.STRING },
	  policenoid: { type: DataTypes.INTEGER },
	  policeno: { type: DataTypes.STRING },
    ho_id: { type: DataTypes.INTEGER },
	  storeid: { type: DataTypes.INTEGER },
	  storecode: { type: DataTypes.STRING },
	  storename: { type: DataTypes.STRING },
	  total_dpp: { type: DataTypes.NUMERIC },
	  total_ppn: { type: DataTypes.NUMERIC },
	  total_netto: { type: DataTypes.NUMERIC },
	  total_dpused: { type: DataTypes.NUMERIC },
	  total_paid: { type: DataTypes.NUMERIC }
  }, {
    tableName: 'vw_report_indent_sales',
    timestamps: false,
    freezeTableName: true
  })
  IndentSales.removeAttribute('id')
  return IndentSales
}



