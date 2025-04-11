"use strict";

module.exports = function (sequelize, DataTypes) {
  var Cash = sequelize.define("tbl_cash_entry", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    transtype: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
	  transkind: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
	  status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
	  description: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    cashierid: {
      type: DataTypes.STRING,
      allowNull: true
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
      tableName: 'tbl_cash_entry',
      timestamps: false,
      freezeTableName: true
    })

  return Cash
}
