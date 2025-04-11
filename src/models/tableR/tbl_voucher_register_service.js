"use strict";

module.exports = function (sequelize, DataTypes) {
  const VoucherListService = sequelize.define("tbl_voucher_register_service", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    vouchercode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serviceid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedby: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
      tableName: 'tbl_voucher_register_service',
      freezeTableName: true
    })
  return VoucherListService
}