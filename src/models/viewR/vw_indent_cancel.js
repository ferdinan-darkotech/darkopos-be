"use strict";

module.exports = function(sequelize, DataTypes) {
  var IndentCancel = sequelize.define("vw_indent_cancel", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    cancelno: { type: DataTypes.STRING },
    transno: { type: DataTypes.STRING },
    cancelat: { type: DataTypes.DATE },
    employeeid: { type: DataTypes.INTEGER },
    employeecode: { type: DataTypes.STRING },
    employeename: { type: DataTypes.STRING },
    dpretur: { type: DataTypes.NUMERIC(16,2) },
    description: { type: DataTypes.STRING }
  }, {
    tableName: 'vw_indent_cancel',
    timestamps: false,
    freezeTableName: true
  })

  IndentCancel.removeAttribute('id')
  return IndentCancel
}



