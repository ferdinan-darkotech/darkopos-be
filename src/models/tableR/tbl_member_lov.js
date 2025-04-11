"use strict";

module.exports = function(sequelize, DataTypes) {
  let MemberLOV = sequelize.define("tbl_member_lov", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    lov_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lov_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    lov_desc: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    active: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: true
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tbl_member_lov',
    freezeTableName: true,
    timestamps: false
  })
  MemberLOV.removeAttribute('id')
  return MemberLOV
}