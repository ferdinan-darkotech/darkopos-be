"use strict";

module.exports = function(sequelize, DataTypes) {
  var IndentDetail = sequelize.define("tbl_indent_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transno: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.NUMERIC(16,2),
      allowNull: true,
      defaultValue: 0
    },
    qty: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: true,
      defaultValue: 0
    },
    returqty: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: true,
      defaultValue: 0
    },
    receiveqty: {
      type: DataTypes.NUMERIC(16,0),
      allowNull: true,
      defaultValue: 0
    },
    signal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdby: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedby: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'tbl_indent_detail',
    timestamps: false,
    freezeTableName: true
  })
  return IndentDetail
}