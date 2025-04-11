"use strict";

module.exports = function (sequelize, DataTypes) {
  var Member = sequelize.define("tbl_native_query", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    qcode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    qtitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    qdesc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    query: {
      type: DataTypes.STRING,
      allowNull: false
    },
    qreplace: {
      type: DataTypes.JSON,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbl_native_query'
    })

  return Member
}