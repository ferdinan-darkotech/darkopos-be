"use strict";

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("tbl_tmp_pos", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    queuenumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    headerid: {
      type: DataTypes.STRING,
      primaryKey: false
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    woNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    member: {
      type: DataTypes.STRING,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    employee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bundle: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 0
    },
    confirm_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    confirm_mechanics: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    voucherPayment: {
      type: DataTypes.JSON,
      allowNull: true
    },
    other_informations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
  }, {
      tableName: 'tbl_tmp_pos',
      freezeTableName: true
    })
  Pos.removeAttribute('id');
  return Pos
}
