"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_mobile_app_image", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUri: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageType: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(1),
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
      tableName: 'tbl_mobile_app_image'
    })

  return Table
}