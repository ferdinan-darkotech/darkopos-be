"use strict";

module.exports = function(sequelize, DataTypes) {
  var CustomReportForm = sequelize.define("tbl_custom_report_form", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    form_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    form_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    form_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_type: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    report_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    form_fields: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    report_layout: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'tbl_custom_report_form',
    freezeTableName: true,
    timestamps: false
  })

  CustomReportForm.removeAttribute('id')

  return CustomReportForm
}