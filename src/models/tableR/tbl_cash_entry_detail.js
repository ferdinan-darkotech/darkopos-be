"use strict";

module.exports = function (sequelize, DataTypes) {
  var Cash = sequelize.define("tbl_cash_entry_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    transno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    coacode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    divcode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deptcode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    balance: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdby: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedby: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_cash_entry_detail',
      timestamps: false,
      freezeTableName: true
    })

  return Cash
}
