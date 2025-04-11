"use strict";

module.exports = function(sequelize, DataTypes) {
  var MemberGroup = sequelize.define("tbl_member_group", {
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
      type: DataTypes.CHAR
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
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
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'tbl_member_group'
  }, {
    uniqueKeys: {
      group_unique_key: {
        fields: ['groupCode']
      }
    }
  })

  return MemberGroup
}