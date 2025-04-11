"use strict";

module.exports = function(sequelize, DataTypes) {
  var MemberGroup = sequelize.define("tbl_member_category", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    categorycode: { type: DataTypes.STRING, allowNull: false },
    categoryname: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdby: { type: DataTypes.STRING(30), allowNull: false },
    createdat: { type: DataTypes.DATE, allowNull: false },
    updatedby: { type: DataTypes.STRING(30), allowNull: true },
    updatedat: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: 'tbl_member_category',
    timestamps: false,
    freezeTableName: true
  })

  return MemberGroup
}