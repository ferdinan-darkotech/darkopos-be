"use strict";

module.exports = function (sequelize, DataTypes) {
  var View = sequelize.define("vw_bundling_003", {
    storeId: { type: DataTypes.INTEGER },
    transNoId: { type: DataTypes.INTEGER },
    posDetailId: { type: DataTypes.INTEGER },
    bundlingId: { type: DataTypes.INTEGER },
    transDate: { type: DataTypes.DATE },
    transTime: { type: DataTypes.DATE },
    productId: { type: DataTypes.INTEGER },
    productCode: { type: DataTypes.STRING },
    productName: { type: DataTypes.STRING },
    qty: { type: DataTypes.NUMERIC },
    sellingPrice: { type: DataTypes.NUMERIC },
    discInvoice: { type: DataTypes.NUMERIC },
    discItem: { type: DataTypes.NUMERIC },
    disc1: { type: DataTypes.NUMERIC },
    disc2: { type: DataTypes.NUMERIC },
    disc3: { type: DataTypes.NUMERIC },
    discount: { type: DataTypes.NUMERIC },
    dpp: { type: DataTypes.NUMERIC },
    ppn: { type: DataTypes.NUMERIC },
    netto: { type: DataTypes.NUMERIC }
  }, { tableName: 'vw_bundling_003' })
  return View
}
