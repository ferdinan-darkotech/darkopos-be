"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_loyalty", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    expirationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    setValue: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaulValue: 0
    },
    newMember: {
      type: DataTypes.INTEGER,
      allowNull: 0,
      defaultValue: 0
    },
    active: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 1
    },
    minPayment: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    maxDiscount: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    deletedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_loyalty'
    })

  return Table
}