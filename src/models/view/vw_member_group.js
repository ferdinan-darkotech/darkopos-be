"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwMemberGroup = sequelize.define("vw_member_group", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    groupCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: 'group_unique_key',
      validate: {
        is: /^[a-z0-9\_]{1,5}$/i
      }
    },
    groupName: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    pendingPayment: {
      type: DataTypes.STRING(15),
      allowNull: false,
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
      timestamps: false,
      freezeTableName: true
    }, {
      tableName: 'vw_member_group'
    }, {
      uniqueKeys: {
        group_unique_key: {
          fields: ['groupCode']
        }
      }
    })

  return vwMemberGroup
}