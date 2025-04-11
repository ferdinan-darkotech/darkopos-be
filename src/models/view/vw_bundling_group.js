"use strict";

module.exports = function (sequelize, DataTypes) {
  var View = sequelize.define("vw_bundling_group", {
    storeId: { type: DataTypes.INTEGER },
    transNoId: { type: DataTypes.INTEGER },
    bundlingId: { type: DataTypes.INTEGER },
    memberId: { type: DataTypes.INTEGER },
    memberCode: { type: DataTypes.STRING },
    memberName: { type: DataTypes.STRING },
    transNo: { type: DataTypes.STRING },
    transDate: { type: DataTypes.DATE },
    transTime: { type: DataTypes.DATE },
    discInvoice: { type: DataTypes.NUMERIC },
    discItem: { type: DataTypes.NUMERIC },
    dpp: { type: DataTypes.NUMERIC },
    ppn: { type: DataTypes.NUMERIC },
    netto: { type: DataTypes.NUMERIC }
  }, { tableName: 'vw_bundling_group' })
  return View
}
