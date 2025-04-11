"use strict";

module.exports = function(sequelize, DataTypes) {
  var Indent = sequelize.define("vw_indent", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    transdate: { type: DataTypes.DATE },
    reference: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING(1) },
    duedate: { type: DataTypes.DATE },
    employeeid: { type: DataTypes.INTEGER },
    employeecode: { type: DataTypes.STRING },
    employeename: { type: DataTypes.STRING },
    memberid: { type: DataTypes.STRING(25) },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    totalitem: { type: DataTypes.INTEGER },
    dpused: { type: DataTypes.NUMERIC(16,2) },
    dpcost: { type: DataTypes.NUMERIC(16,2) },
    dpretur: { type: DataTypes.NUMERIC(16,2) },
    totaldp: { type: DataTypes.NUMERIC(16,2) },
    dpin_dpp: { type: DataTypes.NUMERIC(16,2) },
    dpin_ppn: { type: DataTypes.NUMERIC(16,2) },
    dpout_dpp: { type: DataTypes.NUMERIC(16,2) },
    dpout_ppn: { type: DataTypes.NUMERIC(16,2) },
    total_orderqty: { type: DataTypes.NUMERIC(16,0) },
    total_receiveqty: { type: DataTypes.NUMERIC(16,0) },
    total_returqty: { type: DataTypes.NUMERIC(16,0) },
    description: { type: DataTypes.STRING },
    mobilenumber: { type: DataTypes.STRING },
    phonenumber: { type: DataTypes.STRING },
    createdby: { type: DataTypes.STRING(30) },
    createdat: { type: DataTypes.DATE },
    updatedby: { type: DataTypes.STRING(30) },
    updatedat: { type: DataTypes.DATE },
  }, {
    tableName: 'vw_indent',
    timestamps: false,
    freezeTableName: true
  })
  return Indent
}



