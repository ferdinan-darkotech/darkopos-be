"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_change_sellprice_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      autoIncrement: true
    },
    transNoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    prevDistPrice01: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    prevDistPrice02: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    prevSellPrice: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    distPrice01: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    distPrice02: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    sellPrice: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
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
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_change_sellprice_detail'
    })

  return Table
}