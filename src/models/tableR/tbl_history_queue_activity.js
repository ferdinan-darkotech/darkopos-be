"use strict";

module.exports = function (sequelize, DataTypes) {
  var HistoryQueueActivity = sequelize.define("tbl_history_queue_activity", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    history_id: {
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
    }
  }, {
      tableName: 'tbl_history_queue_activity',
      freezeTableName: true,
      timestamps: false
    })

  HistoryQueueActivity.removeAttribute('id')
  return HistoryQueueActivity
}