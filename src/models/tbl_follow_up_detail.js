"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_follow_up_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    followUpId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    posDetailId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    customerSatisfaction: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
  }, {
      tableName: 'tbl_follow_up_detail'
    })

  return Table
}