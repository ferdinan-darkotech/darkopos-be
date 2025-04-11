"use strict";

module.exports = function(sequelize, DataTypes) {
  var Indent = sequelize.define("tbl_indent", {
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
    transdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
    totalitem: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    duedate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    employeeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    memberid: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    dpcost: {
      type: DataTypes.NUMERIC(16,2),
      allowNull: true,
      defaultValue: 0
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
    taxtype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    taxval: {
      type: DataTypes.NUMERIC(16,2),
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
    tableName: 'tbl_indent',
    timestamps: false,
    freezeTableName: true
  })
  return Indent
}



