"use strict";

module.exports = function (sequelize, DataTypes) {
  var Vendor = sequelize.define("vw_vendor", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    vendor_id: { type: DataTypes.STRING },
    vendor_code: { type: DataTypes.STRING },
    vendor_name: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    zip_code: { type: DataTypes.STRING },
    phone_number: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN },
    kel_id: { type: DataTypes.INTEGER },
    prov_nama: { type: DataTypes.STRING },
    ibukota: { type: DataTypes.STRING },
    kab_nama: { type: DataTypes.STRING },
    kec_nama: { type: DataTypes.STRING },
    kel_nama: { type: DataTypes.STRING },
    pos_kode: { type: DataTypes.STRING },
    created_by: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING },
    updated_at: { type: DataTypes.DATE }
  }, { tableName: 'vw_vendor', freezeTableName: true, timestamps: false })

  Vendor.removeAttribute('id')
  return Vendor
}
