"use strict";


module.exports = function (sequelize, DataTypes) {
  const logApi = sequelize.define("tbl_logs_api", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ids: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_info: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    req_params: {
      type: DataTypes.JSON,
      allowNull: true
    },
    req_body: {
      type: DataTypes.JSON,
      allowNull: true
    },
    client_ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    client_os: {
      type: DataTypes.STRING,
      allowNull: true
    },
    client_cpu: {
      type: DataTypes.STRING,
      allowNull: true
    },
    client_device: {
      type: DataTypes.STRING,
      allowNull: true
    },
    client_engine: {
      type: DataTypes.STRING,
      allowNull: true
    },
    client_browser: {
      type: DataTypes.STRING,
      allowNull: true
    },
    res_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    res_msg: {
      type: DataTypes.STRING,
      allowNull: false
    },
    res_detail: {
      type: DataTypes.JSON,
      allowNull: true
    },
    req_at: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    res_at: {
      type: DataTypes.NUMERIC,
      allowNull: true
    }
  }, { tableName: 'tbl_logs_api', timestamps: false, freezeTableName: true })
  logApi.removeAttribute('id')

  return logApi
}
