"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwUserRole = sequelize.define("vw_role_permission", {
    userId: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    userRole: {
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
  }, {
    tableName: 'vw_role_permission'
  })

  return vwUserRole
}
