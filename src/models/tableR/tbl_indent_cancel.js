"use strict";

module.exports = function(sequelize, DataTypes) {
  var IndentCancel = sequelize.define("tbl_indent_cancel", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cancelno: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dpretur: {
      type: DataTypes.NUMERIC(16,2),
      allowNull: true,
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cancelby: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    cancelat: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'tbl_indent_cancel',
    timestamps: false,
    freezeTableName: true
  })
  IndentCancel.removeAttribute('id')
  return IndentCancel
}



