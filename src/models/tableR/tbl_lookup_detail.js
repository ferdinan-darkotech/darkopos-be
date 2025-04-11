"use strict";

module.exports = function (sequelize, DataTypes) {
  var LookupDetail = sequelize.define("tbl_lookup_detail", {
    lookupgroupcode: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    lookupcode: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    lookupname: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    value1: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    value2: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    value3: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    storeid: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tbl_lookup_detail',
    freezeTableName: true
  })

  return LookupDetail
}