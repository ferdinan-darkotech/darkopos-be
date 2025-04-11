"use strict";

module.exports = function (sequelize, DataTypes) {
  var SocMed = sequelize.define("tbl_social_media", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
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
    },
  }, {
      tableName: 'tbl_social_media',
      paranoid: true,
      timestamp: true
    })
  return SocMed
}