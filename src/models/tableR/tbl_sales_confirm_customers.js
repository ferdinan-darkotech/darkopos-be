"use strict";

module.exports = function(sequelize, DataTypes) {
  var SalesConfirmCustomers = sequelize.define("tbl_sales_confirm_customers", {
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
    customer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hand_by_customer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    no_plat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longtitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    order_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    payment_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_process: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'tbl_sales_confirm_customers',
    freezeTableName: true,
    timestamps: false
  })

  SalesConfirmCustomers.removeAttribute('id')

  return SalesConfirmCustomers
}