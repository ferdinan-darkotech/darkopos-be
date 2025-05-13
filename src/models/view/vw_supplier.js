"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwSupplier = sequelize.define("vw_supplier", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    supplierCode: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_]{6,15}$/i
      }
    },
    supplierName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,50}$/i
      }
    },
    paymentTempo: {
      type: DataTypes.INTEGER
    },
    address01: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{5,50}$/i
      }
    },
    address02: {
      type: DataTypes.STRING(50)
    },
    cityId: {
      type: DataTypes.INTEGER,
    },
    cityName: {
      type: DataTypes.STRING(25),
    },
    state: {
      type: DataTypes.STRING(30),
      validate: {
        is: /^[a-z0-9\_\-]{3,20}$/i
      }
    },
    zipcode: { type: DataTypes.STRING(10) },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{5,20}$/i
      }
    },
    mobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{5,20}$/i
      }
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    taxId: {
      type: DataTypes.STRING(10)
    },
    prov_nama: { type: DataTypes.STRING },
    kab_nama: { type: DataTypes.STRING },
    kec_nama: { type: DataTypes.STRING },
    kel_nama: { type: DataTypes.STRING },
    kel_id: { type: DataTypes.INTEGER },
    zipcode: { type: DataTypes.STRING }
  }, {
      tableName: 'vw_supplier'
    })

  return vwSupplier
}