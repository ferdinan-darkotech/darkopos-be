"use strict";

module.exports = function (sequelize, DataTypes) {
  var QueueActivity = sequelize.define("tbl_queue_activity", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    activity_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    store_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    queue_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text_msg: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    has_read: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
      tableName: 'tbl_queue_activity',
      freezeTableName: true,
      timestamps: false
    })

  QueueActivity.removeAttribute('id')
  return QueueActivity
}