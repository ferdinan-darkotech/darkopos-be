"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwEmployee = sequelize.define("vw_employee", {
    id: {
      type: DataTypes.INTEGER,
    },
    employeeId: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_]{6,15}$/i
      }
    },
    employeeName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    positionId: {
      type: DataTypes.STRING(6),
    },
    positionCode: {
      type: DataTypes.STRING(6),
    },
    positionName: {
      type: DataTypes.STRING(6),
    },
    idNo: {
      type: DataTypes.STRING(6),
    },
    idType: {
      type: DataTypes.STRING(6),
    },
    positionCode: {
      type: DataTypes.STRING(50),
    },
    positionName: {
      type: DataTypes.STRING(50),
    },
    address01: {
      type: DataTypes.STRING(50),
    },
    address02: {
      type: DataTypes.STRING(50),
    },
    cityCode: {
      type: DataTypes.STRING(50),
    },
    cityId: {
      type: DataTypes.INTEGER,
    },
    cityName: {
      type: DataTypes.STRING(25),
    },
    mobileNumber: {
      type: DataTypes.STRING(20),
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
    },
    createdAt: {
      type: DataTypes.STRING(6),
    },
    createdBy: {
      type: DataTypes.STRING(6),
    },
    updatedAt: {
      type: DataTypes.STRING(6),
    },
    updatedBy: {
      type: DataTypes.STRING(6),
    },
    status: { type: DataTypes.BOOLEAN },
    prov_nama: { type: DataTypes.STRING },
    kab_nama: { type: DataTypes.STRING },
    kec_nama: { type: DataTypes.STRING },
    kel_nama: { type: DataTypes.STRING },
    kel_id: { type: DataTypes.INTEGER },
    zipcode: { type: DataTypes.STRING }
  }, {freezeTableName: true}, {
    tableName: 'vw_employee'
  })

  return vwEmployee
}