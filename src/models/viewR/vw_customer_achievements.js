"use strict";

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("vw_customer_achievements", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ho_id: { type: DataTypes.INTEGER },
    ho_code: { type: DataTypes.STRING },
    ho_name: { type: DataTypes.STRING },
    member_type_id: { type: DataTypes.INTEGER },
    member_type_code: { type: DataTypes.STRING },
    member_type_name: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.STRING(30) },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING(30) },
    updated_at: { type: DataTypes.DATE }
  }, {
    tableName: 'vw_customer_achievements',
    freezeTableName: true,
    timestamps: false
  })
}