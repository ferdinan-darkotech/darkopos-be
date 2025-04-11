"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwUserRolePermission = sequelize.define("vw_user_role_permission", {
    userId: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    userName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    roleCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true,
    },
    roleName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    rolePermission: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    isTotp: {
      type: DataTypes.BOOLEAN,
    }
  }, {
      tableName: 'vw_user_role_permission'
    })

  return vwUserRolePermission
}
