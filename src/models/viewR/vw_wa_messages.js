"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("vw_wa_messages", {
    seq: { type: DataTypes.INTEGER, primaryKey: true },
    member_id: { type: DataTypes.INTEGER },
    message_id: { type: DataTypes.INTEGER },
    sender_no: { type: DataTypes.STRING },
    message_text: { type: DataTypes.STRING },
    message_time: { type: DataTypes.DATE },
    message_status: { type: DataTypes.STRING },
    message_type: { type: DataTypes.STRING },
    created_by: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.STRING },
    updated_at: { type: DataTypes.DATE }
  }, { tableName: 'vw_wa_messages' })
}
