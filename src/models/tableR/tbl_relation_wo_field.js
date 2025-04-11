"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_relation_wo_field", {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true
    },
    fieldid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    relationfieldid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
  }, {
      tableName: 'tbl_relation_wo_field',
      freezeTableName: true
    })

  return Table
}