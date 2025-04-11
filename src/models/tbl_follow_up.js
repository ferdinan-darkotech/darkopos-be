"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_follow_up", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    posId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    lastCaller: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    lastCall: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    customerSatisfaction: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    postService: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    // postServiceReason: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true
    // },
    nextCall: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pendingReason: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    denyOfferingReason: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    acceptOfferingDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    acceptOfferingReason: {
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
      tableName: 'tbl_follow_up'
    })

  return Table
}