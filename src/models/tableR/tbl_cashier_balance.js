"use strict";
import moment from 'moment'

module.exports = function(sequelize, DataTypes) {
  var productPrice = sequelize.define("tbl_cashier_balance", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cashierid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    period: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return this.getDataValue('period') ? moment(this.getDataValue('period')).format('YYYY-MM-DD') : null;
      }
    },
    transkind: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    beginbalance: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, { tableName: 'tbl_cashier_balance', freezeTableName: true, timestamps: false })

  return productPrice
}