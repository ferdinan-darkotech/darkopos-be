"use strict";

module.exports = function (sequelize, DataTypes) {
  var Vendor = sequelize.define("tbl_vendor", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    vendor_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendor_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vendor_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    kel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      tableName: 'tbl_vendor',
      freezeTableName: true,
      timestamps: false
    })

    Vendor.removeAttribute('id')
  return Vendor
}