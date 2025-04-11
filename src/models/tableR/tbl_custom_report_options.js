'use strict'

module.exports = (sequelize, DataTypes) => {
  const CustomReportOptions =  sequelize.define('tbl_custom_report_options', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    option_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    report_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    report_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    form: {
      type: DataTypes.STRING,
      allowNull: true
    },
    query: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parent_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sort_index: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, { tableName: 'tbl_custom_report_options', timestamps: false, freezeTableName: true })

  CustomReportOptions.removeAttribute('id')
  return CustomReportOptions

}