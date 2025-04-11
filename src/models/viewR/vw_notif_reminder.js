
"use strict";

module.exports = function (sequelize, DataTypes) {
    var notif_reminder = sequelize.define("vw_notif_reminder", {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      storeid: { type: DataTypes.INTEGER },
      storecode: { type: DataTypes.INTEGER },
      storename: { type: DataTypes.STRING },
      notifcode: { type: DataTypes.STRING },
      notifname: { type: DataTypes.STRING },
      notifaccess: { type: DataTypes.STRING },
      redirectto: { type: DataTypes.STRING }
    }, {
      tableName: 'vw_notif_reminder'
    })
    return notif_reminder
}

