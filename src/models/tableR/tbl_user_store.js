"use strict";

module.exports = function(sequelize, DataTypes) {
  var City = sequelize.define("tbl_user_store", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userstoreid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    defaultstore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 0
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
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'tbl_user_store',
    freezeTableName: true,
    timestamps: false
  })

  return City
}