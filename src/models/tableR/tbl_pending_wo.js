"use strict";

module.exports = function (sequelize, DataTypes) {
  var FPW = sequelize.define("tbl_pending_wo", {
    record_id: {
      type: DataTypes.STRING(50),
      autoIncrement: false,
      primaryKey: true
    },
    store: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    member: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'member'
    },
    unit: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    verified_wa_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    trans_header: {
      type: DataTypes.JSON,
      allowNull: false
    },
    trans_detail: {
      type: DataTypes.JSON,
      allowNull: false
    },
    other_informations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    workorder: {
      type: DataTypes.JSON,
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
      tableName: 'tbl_pending_wo'
    })

  return FPW
}