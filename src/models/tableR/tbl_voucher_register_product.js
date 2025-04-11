"use strict";

module.exports = function (sequelize, DataTypes) {
  const VoucherListProduct = sequelize.define("tbl_voucher_register_product", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    vouchercode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productid: {
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
      tableName: 'tbl_voucher_register_product',
      freezeTableName: true
    })
  return VoucherListProduct
}