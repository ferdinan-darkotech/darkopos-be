"use strict";

module.exports = function(sequelize, DataTypes) {
  var IndentSalesDetail = sequelize.define("vw_report_indent_detail_sales", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    indentno: { type: DataTypes.STRING },
	  salesno: { type: DataTypes.STRING },
	  salesdate: { type: DataTypes.DATE },
    ho_id: { type: DataTypes.INTEGER },
	  storeid: { type: DataTypes.INTEGER },
	  storecode: { type: DataTypes.STRING },
	  storename: { type: DataTypes.STRING },
	  productid: { type: DataTypes.INTEGER },
	  productcode: { type: DataTypes.STRING },
	  productname: { type: DataTypes.STRING },
	  qty: { type: DataTypes.NUMERIC },
	  disc1: { type: DataTypes.NUMERIC },
	  disc2: { type: DataTypes.NUMERIC },
	  disc3: { type: DataTypes.NUMERIC },
	  discount: { type: DataTypes.NUMERIC },
	  max_disc_nominal: { type: DataTypes.NUMERIC },
	  max_disc_percent: { type: DataTypes.NUMERIC },
	  dpp: { type: DataTypes.NUMERIC },
	  ppn: { type: DataTypes.NUMERIC },
	  netto: { type: DataTypes.NUMERIC }
  }, {
    tableName: 'vw_report_indent_detail_sales',
    timestamps: false,
    freezeTableName: true
  })
  IndentSalesDetail.removeAttribute('id')
  return IndentSalesDetail
}



