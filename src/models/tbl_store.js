"use strict";

module.exports = function (sequelize, DataTypes) {
  var Store = sequelize.define("tbl_store", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    storeName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    storeParentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    address01: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    address02: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    // cityId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    state: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    zipCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    mobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(30),
    },
    initial: {
      type: DataTypes.STRING(4)
    },
    companyName: {
      type: DataTypes.STRING(65),
    },
    taxID: {
      type: DataTypes.STRING(15)
    },
    taxConfirmDate: {
      type: DataTypes.DATE
    },
    taxType: {
      type: DataTypes.STRING(1)
    },
    shortName: {
      type: DataTypes.STRING(20)
    },
    latitude: {
      type: DataTypes.DECIMAL(28, 24),
    },
    longitude: {
      type: DataTypes.DECIMAL(28, 24),
    },
    cashierShift: {
      type: DataTypes.STRING(10)
    },
    cashierCounter: {
      type: DataTypes.STRING(10)
    },
    settingValue: {
      type: DataTypes.JSON
    },
    ho_id: { type: DataTypes.INTEGER },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_store'
    })

  return Store
}