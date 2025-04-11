"use strict";

module.exports = function (sequelize, DataTypes) {
  var FWM = sequelize.define("vw_wa_messages", {
    seq: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sender_no: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    message_text: {                                                           
      type: DataTypes.STRING(250),
      allowNull: true
    },
    message_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    message_status: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    message_type: {                                                           
      type: DataTypes.STRING(35),
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
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
      tableName: 'vw_wa_messages'
    })

  return FWM
}