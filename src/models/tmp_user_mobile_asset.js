"use strict";

module.exports = function (sequelize, DataTypes) {
  var MemberAsset = sequelize.define("tmp_user_mobile_asset", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    memberCardId: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    policeNo: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    merk: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
    chassisNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    machineNo: {
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
      tableName: 'tmp_user_mobile_asset'
    })

  return MemberAsset
}