"use strict";

module.exports = function(sequelize, DataTypes) {
  var SalesConfirmCustomers = sequelize.define("tbl_sales_confirm_mechanics", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    confirm_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    app_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    app_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    employee: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    in_longtitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    in_latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    out_longtitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    out_latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tap_in: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tap_out: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_process: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'tbl_sales_confirm_mechanics',
    freezeTableName: true,
    timestamps: false
  })

  SalesConfirmCustomers.removeAttribute('id')

  return SalesConfirmCustomers
}