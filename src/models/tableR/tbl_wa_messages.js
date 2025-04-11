"use strict";

module.exports = function (sequelize, DataTypes) {
  var FWM = sequelize.define("tbl_wa_messages", {
    seq: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    wa_number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    message_text: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    message_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    message_status: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    message_type: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    base64_file: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    member_code: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      tableName: 'tbl_wa_messages'
    })

  return FWM
}