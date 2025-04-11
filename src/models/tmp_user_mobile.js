"use strict";

module.exports = function (sequelize, DataTypes) {
  var Member = sequelize.define("tmp_user_mobile", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    memberCardId: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    memberEmail: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    memberName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    memberPoint: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    validThrough: {
      type: DataTypes.STRING(17),
      allowNull: true,
    },
    mobileActivate: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: 0,
    },
    mobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
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
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tmp_user_mobile'
    })

  return Member
}